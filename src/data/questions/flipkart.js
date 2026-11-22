export const FLIPKART_QUESTIONS = [
    {
        id: 'flpk-1',
        company: 'flipkart',
        category: 'product',
        number: 1,
        title: 'Aggressive Cows Stall Placement',
        difficulty: 'Medium',
        topic: 'Binary Search on Answer',
        frequency: '98% in Flipkart Grid & SDE-1 OA',
        context: 'Maximizing minimum spacing between warehouse loading bays',
        fnName: 'solve',
        params: [{ name: 'stalls', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given an array `stalls` representing positions of `n` stalls and `k` aggressive cows, assign the cows to the stalls such that the minimum distance between any two cows is as large as possible. Return the largest minimum distance.',
        constraints: ['2 <= k <= stalls.length <= 10^5'],
        hint: 'Sort stalls and binary search distance d in [1, stalls[-1] - stalls[0]], greedily placing cows.',
        starter: {
            python: 'def solve(stalls, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(stalls, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(stalls, k):\n    s = sorted(stalls)\n    def can(d):\n        cnt, last = 1, s[0]\n        for p in s[1:]:\n            if p - last >= d: cnt += 1; last = p\n        return cnt >= k\n    lo, hi, ans = 1, s[-1] - s[0], 0\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if can(mid): ans = mid; lo = mid + 1\n        else: hi = mid - 1\n    return ans',
            javascript: 'function solve(stalls, k) {\n    const s = [...stalls].sort((a, b) => a - b);\n    const can = (d) => {\n        let cnt = 1, last = s[0];\n        for (let i = 1; i < s.length; i++) if (s[i] - last >= d) { cnt++; last = s[i]; }\n        return cnt >= k;\n    };\n    let lo = 1, hi = s[s.length - 1] - s[0], ans = 0;\n    while (lo <= hi) {\n        const mid = (lo + hi) >> 1;\n        if (can(mid)) { ans = mid; lo = mid + 1; }\n        else hi = mid - 1;\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[1, 2, 4, 8, 9], 3], expected: 3, isHidden: false },
            { args: [[10, 1, 2, 7, 5], 3], expected: 4, isHidden: false },
            { args: [[2, 12, 11, 3, 26, 7], 5], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'flpk-2',
        company: 'flipkart',
        category: 'product',
        number: 2,
        title: 'Fractional Knapsack Maximum Value',
        difficulty: 'Medium',
        topic: 'Greedy & Sorting',
        frequency: '94% in Flipkart Campus OA',
        context: 'Packing delivery truck cargo by highest value-per-kg ratio',
        fnName: 'solve',
        params: [{ name: 'values', type: 'int[]' }, { name: 'weights', type: 'int[]' }, { name: 'capacity', type: 'int' }],
        returnType: 'float',
        description: 'Given `values` and `weights` of `n` items and a knapsack of `capacity`, you can take fractions of items. Return the maximum total value rounded to 2 decimal places.',
        constraints: ['1 <= values.length <= 10^4'],
        hint: 'Sort items by value/weight descending and greedily pick full or fractional amounts.',
        starter: {
            python: 'def solve(values, weights, capacity):\n    # Write your logic here\n    return 0.0',
            javascript: 'function solve(values, weights, capacity) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(values, weights, capacity):\n    items = sorted(zip(values, weights), key=lambda x: x[0] / x[1], reverse=True)\n    total = 0.0\n    rem = capacity\n    for v, w in items:\n        if rem == 0: break\n        take = min(w, rem)\n        total += take * (v / w)\n        rem -= take\n    return round(total, 2)',
            javascript: 'function solve(values, weights, capacity) {\n    const items = values.map((v, i) => [v, weights[i]]).sort((a, b) => (b[0] / b[1]) - (a[0] / a[1]));\n    let total = 0, rem = capacity;\n    for (const [v, w] of items) {\n        if (rem === 0) break;\n        const take = Math.min(w, rem);\n        total += take * (v / w);\n        rem -= take;\n    }\n    return Number(total.toFixed(2));\n}'
        },
        testCases: [
            { args: [[60, 100, 120], [10, 20, 30], 50], expected: 240, isHidden: false },
            { args: [[60, 100], [10, 20], 50], expected: 160, isHidden: false },
            { args: [[500], [30], 10], expected: 166.67, isHidden: true }
        ]
    },
    {
        id: 'flpk-3',
        company: 'flipkart',
        category: 'product',
        number: 3,
        title: 'Job Sequencing Maximum Profit',
        difficulty: 'Medium',
        topic: 'Greedy',
        frequency: '93% in Flipkart SDE-1',
        context: 'Scheduling Big Billion Days flash-sale jobs before deadlines',
        fnName: 'solve',
        params: [{ name: 'deadlines', type: 'int[]' }, { name: 'profits', type: 'int[]' }],
        returnType: 'int',
        description: 'Each job `i` takes 1 unit of time, has a `deadlines[i]` (>= 1), and yields `profits[i]` if completed on or before its deadline. Only one job can run at a time. Return the maximum total profit.',
        constraints: ['1 <= deadlines.length <= 10^4'],
        hint: 'Sort jobs by profit descending and place each job in the latest free slot <= deadline.',
        starter: {
            python: 'def solve(deadlines, profits):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(deadlines, profits) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(deadlines, profits):\n    jobs = sorted(zip(profits, deadlines), reverse=True)\n    max_d = max(deadlines)\n    slots = [False] * (max_d + 1)\n    ans = 0\n    for p, d in jobs:\n        for t in range(d, 0, -1):\n            if not slots[t]:\n                slots[t] = True\n                ans += p\n                break\n    return ans',
            javascript: 'function solve(deadlines, profits) {\n    const jobs = profits.map((p, i) => [p, deadlines[i]]).sort((a, b) => b[0] - a[0]);\n    const maxD = Math.max(...deadlines);\n    const slots = new Array(maxD + 1).fill(false);\n    let ans = 0;\n    for (const [p, d] of jobs) {\n        for (let t = d; t >= 1; t--) {\n            if (!slots[t]) { slots[t] = true; ans += p; break; }\n        }\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[4, 1, 1, 1], [20, 10, 40, 30]], expected: 60, isHidden: false },
            { args: [[2, 1, 2, 1, 1], [100, 19, 27, 25, 15]], expected: 127, isHidden: false },
            { args: [[1, 1], [50, 80]], expected: 80, isHidden: true }
        ]
    },
    {
        id: 'flpk-4',
        company: 'flipkart',
        category: 'product',
        number: 4,
        title: 'Largest Rectangle in Histogram',
        difficulty: 'Hard',
        topic: 'Monotonic Stack',
        frequency: '95% in Flipkart Onsite',
        context: 'Finding largest rectangular ad banner area across price bars',
        fnName: 'solve',
        params: [{ name: 'heights', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an array of integers `heights` representing the histogram bar heights where the width of each bar is `1`, return the area of the largest rectangle in the histogram.',
        constraints: ['1 <= heights.length <= 10^5'],
        hint: 'Maintain an increasing monotonic stack of indices; pop when current height < stack top and compute area.',
        starter: {
            python: 'def solve(heights):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(heights) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(heights):\n    st = []\n    best = 0\n    for i, h in enumerate(heights + [0]):\n        while st and heights[st[-1]] > h:\n            height = heights[st.pop()]\n            width = i if not st else i - st[-1] - 1\n            best = max(best, height * width)\n        st.append(i)\n    return best',
            javascript: 'function solve(heights) {\n    const st = [];\n    let best = 0;\n    const arr = [...heights, 0];\n    for (let i = 0; i < arr.length; i++) {\n        while (st.length && arr[st[st.length - 1]] > arr[i]) {\n            const h = arr[st.pop()];\n            const w = st.length ? i - st[st.length - 1] - 1 : i;\n            best = Math.max(best, h * w);\n        }\n        st.push(i);\n    }\n    return best;\n}'
        },
        testCases: [
            { args: [[2, 1, 5, 6, 2, 3]], expected: 10, isHidden: false },
            { args: [[2, 4]], expected: 4, isHidden: false },
            { args: [[6, 2, 5, 4, 5, 1, 6]], expected: 12, isHidden: true }
        ]
    },
    {
        id: 'flpk-5',
        company: 'flipkart',
        category: 'product',
        number: 5,
        title: 'First Negative Integer in Every Window of Size K',
        difficulty: 'Easy',
        topic: 'Sliding Window & Queue',
        frequency: '91% in Flipkart OA',
        context: 'Flagging first negative inventory delta per K-hour rolling window',
        fnName: 'solve',
        params: [{ name: 'arr', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int[]',
        description: 'Given an array `arr` and window size `k`, return an array containing the first negative integer in every contiguous window of size `k`, or `0` if a window has no negative integers.',
        constraints: ['1 <= k <= arr.length <= 10^5'],
        hint: 'Maintain a deque of indices of negative elements within the current window.',
        starter: {
            python: 'def solve(arr, k):\n    # Write your logic here\n    return []',
            javascript: 'function solve(arr, k) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(arr, k):\n    from collections import deque\n    dq = deque()\n    res = []\n    for i, x in enumerate(arr):\n        if x < 0: dq.append(i)\n        if dq and dq[0] <= i - k: dq.popleft()\n        if i >= k - 1:\n            res.append(arr[dq[0]] if dq else 0)\n    return res',
            javascript: 'function solve(arr, k) {\n    const dq = [], res = [];\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i] < 0) dq.push(i);\n        if (dq.length && dq[0] <= i - k) dq.shift();\n        if (i >= k - 1) res.push(dq.length ? arr[dq[0]] : 0);\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [[-8, 2, 3, -6, 10], 2], expected: [-8, 0, -6, -6], isHidden: false },
            { args: [[12, -1, -7, 8, -15, 30, 16, 28], 3], expected: [-1, -1, -7, -15, -15, 0], isHidden: false },
            { args: [[1, 2, 3, 4], 2], expected: [0, 0, 0], isHidden: true }
        ]
    },
    {
        id: 'flpk-6',
        company: 'flipkart',
        category: 'product',
        number: 6,
        title: 'Count Subarrays With Given XOR K',
        difficulty: 'Medium',
        topic: 'Prefix XOR & Hash Map',
        frequency: '90% in Flipkart SDE-1',
        context: 'Checking XOR parity checksum segments in warehouse scanner logs',
        fnName: 'solve',
        params: [{ name: 'arr', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given an array of integers `arr` and an integer `k`, return the total number of subarrays having bitwise XOR of all elements equal to `k`.',
        constraints: ['1 <= arr.length <= 10^5'],
        hint: 'Track prefix XOR frequencies in a map; add freq[prefixXor ^ k] at each step.',
        starter: {
            python: 'def solve(arr, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(arr, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(arr, k):\n    freq = {0: 1}\n    xr = ans = 0\n    for x in arr:\n        xr ^= x\n        ans += freq.get(xr ^ k, 0)\n        freq[xr] = freq.get(xr, 0) + 1\n    return ans',
            javascript: 'function solve(arr, k) {\n    const freq = new Map([[0, 1]]);\n    let xr = 0, ans = 0;\n    for (const x of arr) {\n        xr ^= x;\n        ans += freq.get(xr ^ k) || 0;\n        freq.set(xr, (freq.get(xr) || 0) + 1);\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[4, 2, 2, 6, 4], 6], expected: 4, isHidden: false },
            { args: [[5, 6, 7, 8, 9], 5], expected: 2, isHidden: false },
            { args: [[1, 1, 1], 1], expected: 4, isHidden: true }
        ]
    },
    {
        id: 'flpk-7',
        company: 'flipkart',
        category: 'product',
        number: 7,
        title: 'Sum of Subarray Minimums',
        difficulty: 'Medium',
        topic: 'Monotonic Stack',
        frequency: '88% in Flipkart Machine Coding',
        context: 'Aggregating minimum SLA latency across all contiguous query spans',
        fnName: 'solve',
        params: [{ name: 'arr', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an array of integers `arr`, find the sum of `min(b)` where `b` ranges over every contiguous subarray of `arr`, modulo `10^9 + 7`.',
        constraints: ['1 <= arr.length <= 3 * 10^4'],
        hint: 'For each element arr[i], find previous smaller (strictly) and next smaller-or-equal distances using a monotonic stack.',
        starter: {
            python: 'def solve(arr):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(arr) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(arr):\n    MOD = 10**9 + 7\n    n = len(arr)\n    left, right = [0] * n, [0] * n\n    st = []\n    for i in range(n):\n        while st and arr[st[-1]] > arr[i]: st.pop()\n        left[i] = i + 1 if not st else i - st[-1]\n        st.append(i)\n    st = []\n    for i in range(n - 1, -1, -1):\n        while st and arr[st[-1]] >= arr[i]: st.pop()\n        right[i] = n - i if not st else st[-1] - i\n        st.append(i)\n    return sum(arr[i] * left[i] * right[i] for i in range(n)) % MOD',
            javascript: 'function solve(arr) {\n    const MOD = 1000000007;\n    const n = arr.length;\n    const left = new Array(n), right = new Array(n);\n    let st = [];\n    for (let i = 0; i < n; i++) {\n        while (st.length && arr[st[st.length - 1]] > arr[i]) st.pop();\n        left[i] = st.length ? i - st[st.length - 1] : i + 1;\n        st.push(i);\n    }\n    st = [];\n    for (let i = n - 1; i >= 0; i--) {\n        while (st.length && arr[st[st.length - 1]] >= arr[i]) st.pop();\n        right[i] = st.length ? st[st.length - 1] - i : n - i;\n        st.push(i);\n    }\n    let total = 0;\n    for (let i = 0; i < n; i++) total = (total + arr[i] * left[i] * right[i]) % MOD;\n    return total;\n}'
        },
        testCases: [
            { args: [[3, 1, 2, 4]], expected: 17, isHidden: false },
            { args: [[11, 81, 94, 43, 3]], expected: 444, isHidden: false },
            { args: [[5]], expected: 5, isHidden: true }
        ]
    },
    {
        id: 'flpk-8',
        company: 'flipkart',
        category: 'product',
        number: 8,
        title: 'Painter Partition Minimum Time',
        difficulty: 'Hard',
        topic: 'Binary Search on Answer',
        frequency: '92% in Flipkart SDE-1',
        context: 'Minimizing max packing time across K contiguous warehouse stations',
        fnName: 'solve',
        params: [{ name: 'boards', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given `boards` of lengths `boards[i]` and `k` painters (each painter paints contiguous boards at 1 unit/min), return the minimum time to paint all boards.',
        constraints: ['1 <= boards.length <= 10^5'],
        hint: 'Binary search max allowed load per painter in [max(boards), sum(boards)].',
        starter: {
            python: 'def solve(boards, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(boards, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(boards, k):\n    def can(cap):\n        painters, cur = 1, 0\n        for b in boards:\n            if cur + b > cap:\n                painters += 1; cur = b\n            else: cur += b\n        return painters <= k\n    lo, hi = max(boards), sum(boards)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if can(mid): hi = mid\n        else: lo = mid + 1\n    return lo',
            javascript: 'function solve(boards, k) {\n    const can = (cap) => {\n        let p = 1, cur = 0;\n        for (const b of boards) {\n            if (cur + b > cap) { p++; cur = b; } else cur += b;\n        }\n        return p <= k;\n    };\n    let lo = Math.max(...boards), hi = boards.reduce((a, b) => a + b, 0);\n    while (lo < hi) {\n        const mid = Math.floor((lo + hi) / 2);\n        if (can(mid)) hi = mid;\n        else lo = mid + 1;\n    }\n    return lo;\n}'
        },
        testCases: [
            { args: [[5, 10, 30, 20, 15], 3], expected: 35, isHidden: false },
            { args: [[10, 20, 30, 40], 2], expected: 60, isHidden: false },
            { args: [[10, 10, 10, 10], 2], expected: 20, isHidden: true }
        ]
    },
    {
        id: 'flpk-9',
        company: 'flipkart',
        category: 'product',
        number: 9,
        title: 'Knight Minimum Steps on Chessboard',
        difficulty: 'Medium',
        topic: 'BFS Graph',
        frequency: '90% in Flipkart Coding Round',
        context: 'Shortest L-shaped drone hop path on N x N warehouse grid',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }, { name: 'start', type: 'int[]' }, { name: 'target', type: 'int[]' }],
        returnType: 'int',
        description: 'On an `n x n` chessboard (0-indexed), return the minimum steps a knight needs to move from `start = [r1, c1]` to `target = [r2, c2]`, or `-1` if unreachable.',
        constraints: ['1 <= n <= 100'],
        hint: 'Run BFS from start over the 8 knight moves.',
        starter: {
            python: 'def solve(n, start, target):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(n, start, target) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(n, start, target):\n    from collections import deque\n    if start == target: return 0\n    q = deque([(start[0], start[1], 0)])\n    vis = {(start[0], start[1])}\n    moves = [(-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1)]\n    while q:\n        r, c, d = q.popleft()\n        for dr, dc in moves:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in vis:\n                if [nr, nc] == target: return d + 1\n                vis.add((nr, nc))\n                q.append((nr, nc, d + 1))\n    return -1',
            javascript: 'function solve(n, start, target) {\n    if (start[0] === target[0] && start[1] === target[1]) return 0;\n    const q = [[start[0], start[1], 0]];\n    const vis = new Set([`${start[0]},${start[1]}`]);\n    const moves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];\n    while (q.length) {\n        const [r, c, d] = q.shift();\n        for (const [dr, dc] of moves) {\n            const nr = r + dr, nc = c + dc;\n            const key = `${nr},${nc}`;\n            if (nr >= 0 && nr < n && nc >= 0 && nc < n && !vis.has(key)) {\n                if (nr === target[0] && nc === target[1]) return d + 1;\n                vis.add(key); q.push([nr, nc, d + 1]);\n            }\n        }\n    }\n    return -1;\n}'
        },
        testCases: [
            { args: [6, [3, 4], [0, 0]], expected: 3, isHidden: false },
            { args: [8, [0, 0], [0, 0]], expected: 0, isHidden: false },
            { args: [3, [0, 0], [1, 1]], expected: -1, isHidden: true }
        ]
    },
    {
        id: 'flpk-10',
        company: 'flipkart',
        category: 'product',
        number: 10,
        title: 'Shortest Path in Binary Matrix (8-Directional)',
        difficulty: 'Medium',
        topic: 'BFS Graph',
        frequency: '88% in Flipkart Logistics Tech',
        context: 'Navigating warehouse AGV bot across clear grid cells diagonally',
        fnName: 'solve',
        params: [{ name: 'grid', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given an `n x n` binary matrix `grid`, return the length (number of cells) of the shortest clear path (cells with value `0`, moving 8-directionally) from top-left `(0, 0)` to bottom-right `(n-1, n-1)`, or `-1` if none exists.',
        constraints: ['1 <= n <= 100'],
        hint: 'Use standard BFS starting at (0, 0) if grid[0][0] == 0.',
        starter: {
            python: 'def solve(grid):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(grid) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(grid):\n    from collections import deque\n    n = len(grid)\n    if grid[0][0] or grid[n-1][n-1]: return -1\n    if n == 1: return 1\n    q = deque([(0, 0, 1)])\n    vis = {(0, 0)}\n    while q:\n        r, c, d = q.popleft()\n        for dr in (-1, 0, 1):\n            for dc in (-1, 0, 1):\n                if dr == 0 and dc == 0: continue\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr, nc) not in vis:\n                    if nr == n - 1 and nc == n - 1: return d + 1\n                    vis.add((nr, nc))\n                    q.append((nr, nc, d + 1))\n    return -1',
            javascript: 'function solve(grid) {\n    const n = grid.length;\n    if (grid[0][0] || grid[n - 1][n - 1]) return -1;\n    if (n === 1) return 1;\n    const q = [[0, 0, 1]], vis = new Set(["0,0"]);\n    while (q.length) {\n        const [r, c, d] = q.shift();\n        for (let dr = -1; dr <= 1; dr++) {\n            for (let dc = -1; dc <= 1; dc++) {\n                if (!dr && !dc) continue;\n                const nr = r + dr, nc = c + dc, key = `${nr},${nc}`;\n                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0 && !vis.has(key)) {\n                    if (nr === n - 1 && nc === n - 1) return d + 1;\n                    vis.add(key); q.push([nr, nc, d + 1]);\n                }\n            }\n        }\n    }\n    return -1;\n}'
        },
        testCases: [
            { args: [[[0, 1], [1, 0]]], expected: 2, isHidden: false },
            { args: [[[0, 0, 0], [1, 1, 0], [1, 1, 0]]], expected: 4, isHidden: false },
            { args: [[[1, 0, 0], [1, 1, 0], [1, 1, 0]]], expected: -1, isHidden: true }
        ]
    },
    {
        id: 'flpk-11',
        company: 'flipkart',
        category: 'product',
        number: 11,
        title: 'Minimum Cost Ropes Connection',
        difficulty: 'Easy',
        topic: 'Min Heap / Greedy',
        frequency: '89% in Flipkart Campus Coding',
        context: 'Merging sorted product catalog shards with minimal I/O cost',
        fnName: 'solve',
        params: [{ name: 'ropes', type: 'int[]' }],
        returnType: 'int',
        description: 'Given `n` ropes of different lengths, connecting two ropes costs the sum of their lengths. Return the minimum total cost to connect all ropes into one.',
        constraints: ['1 <= ropes.length <= 10^5'],
        hint: 'Repeatedly extract the two smallest ropes using a min-heap, sum them, add to cost, and push back.',
        starter: {
            python: 'def solve(ropes):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(ropes) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(ropes):\n    import heapq\n    h = list(ropes)\n    heapq.heapify(h)\n    cost = 0\n    while len(h) > 1:\n        s = heapq.heappop(h) + heapq.heappop(h)\n        cost += s\n        heapq.heappush(h, s)\n    return cost',
            javascript: 'function solve(ropes) {\n    const arr = [...ropes];\n    let cost = 0;\n    while (arr.length > 1) {\n        arr.sort((a, b) => a - b);\n        const s = arr.shift() + arr.shift();\n        cost += s;\n        arr.push(s);\n    }\n    return cost;\n}'
        },
        testCases: [
            { args: [[4, 3, 2, 6]], expected: 29, isHidden: false },
            { args: [[4, 2, 7, 6, 9]], expected: 62, isHidden: false },
            { args: [[10]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'flpk-12',
        company: 'flipkart',
        category: 'product',
        number: 12,
        title: 'Zero Sum Subarrays Count',
        difficulty: 'Medium',
        topic: 'Prefix Sum & Hash Map',
        frequency: '87% in Flipkart OA',
        context: 'Counting net-zero inventory adjustment sequences',
        fnName: 'solve',
        params: [{ name: 'arr', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer array `arr`, return the total number of contiguous subarrays whose sum is equal to `0`.',
        constraints: ['1 <= arr.length <= 10^5'],
        hint: 'Use a frequency map of prefix sums initialized with {0: 1}.',
        starter: {
            python: 'def solve(arr):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(arr) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(arr):\n    freq = {0: 1}\n    s = ans = 0\n    for x in arr:\n        s += x\n        ans += freq.get(s, 0)\n        freq[s] = freq.get(s, 0) + 1\n    return ans',
            javascript: 'function solve(arr) {\n    const freq = new Map([[0, 1]]);\n    let s = 0, ans = 0;\n    for (const x of arr) {\n        s += x;\n        ans += freq.get(s) || 0;\n        freq.set(s, (freq.get(s) || 0) + 1);\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[0, 0, 5, 5, 0, 0]], expected: 6, isHidden: false },
            { args: [[6, -1, -3, 4, -2, 2, 4, 6, -12, -7]], expected: 4, isHidden: false },
            { args: [[1, 2, 3]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'flpk-13',
        company: 'flipkart',
        category: 'product',
        number: 13,
        title: 'Next Greater Circular Element',
        difficulty: 'Medium',
        topic: 'Monotonic Stack',
        frequency: '89% in Flipkart SDE-1',
        context: 'Finding next higher price tier in circular sale carousel',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given a circular integer array `nums`, return the next greater number for every element in `nums` (wrapping around to the beginning if necessary), or `-1` if none exists.',
        constraints: ['1 <= nums.length <= 10^4'],
        hint: 'Iterate 2 * n times using index i % n with a monotonic decreasing stack.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return []',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(nums):\n    n = len(nums)\n    res = [-1] * n\n    st = []\n    for i in range(2 * n):\n        while st and nums[st[-1]] < nums[i % n]:\n            res[st.pop()] = nums[i % n]\n        if i < n: st.append(i)\n    return res',
            javascript: 'function solve(nums) {\n    const n = nums.length, res = new Array(n).fill(-1), st = [];\n    for (let i = 0; i < 2 * n; i++) {\n        const idx = i % n;\n        while (st.length && nums[st[st.length - 1]] < nums[idx]) res[st.pop()] = nums[idx];\n        if (i < n) st.push(i);\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [[1, 2, 1]], expected: [2, -1, 2], isHidden: false },
            { args: [[1, 2, 3, 4, 3]], expected: [2, 3, 4, -1, 4], isHidden: false },
            { args: [[5, 5, 5]], expected: [-1, -1, -1], isHidden: true }
        ]
    },
    {
        id: 'flpk-14',
        company: 'flipkart',
        category: 'product',
        number: 14,
        title: 'Minimum Cost to Make Array Elements Equal',
        difficulty: 'Medium',
        topic: 'Sorting & Median',
        frequency: '85% in Flipkart Analytics',
        context: 'Harmonizing seller catalog prices to median value',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer array `nums` of size `n`, in one move you can increment or decrement an element by `1`. Return the minimum number of moves required to make all array elements equal.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Sort the array and move every element to the median nums[n // 2].',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    a = sorted(nums)\n    med = a[len(a) // 2]\n    return sum(abs(x - med) for x in a)',
            javascript: 'function solve(nums) {\n    const a = [...nums].sort((x, y) => x - y);\n    const med = a[Math.floor(a.length / 2)];\n    return a.reduce((acc, x) => acc + Math.abs(x - med), 0);\n}'
        },
        testCases: [
            { args: [[1, 2, 3]], expected: 2, isHidden: false },
            { args: [[1, 10, 2, 9]], expected: 16, isHidden: false },
            { args: [[5]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'flpk-15',
        company: 'flipkart',
        category: 'product',
        number: 15,
        title: 'Maximize Happiness of Selected Children',
        difficulty: 'Medium',
        topic: 'Greedy & Sorting',
        frequency: '84% in Flipkart OA',
        context: 'Selecting top K promotional deals as remaining values decay by 1 each round',
        fnName: 'solve',
        params: [{ name: 'happiness', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given `happiness` of `n` items, in each of `k` turns you pick one unpicked item and add its current value (`max(0, val - turn)`), while all remaining unpicked items decrease by `1`. Return the maximum total sum after `k` picks.',
        constraints: ['1 <= k <= happiness.length <= 2 * 10^5'],
        hint: 'Sort descending and pick the top k items, adding max(0, a[i] - i).',
        starter: {
            python: 'def solve(happiness, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(happiness, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(happiness, k):\n    a = sorted(happiness, reverse=True)\n    return sum(max(0, a[i] - i) for i in range(k))',
            javascript: 'function solve(happiness, k) {\n    const a = [...happiness].sort((x, y) => y - x);\n    let total = 0;\n    for (let i = 0; i < k; i++) total += Math.max(0, a[i] - i);\n    return total;\n}'
        },
        testCases: [
            { args: [[1, 2, 3], 2], expected: 4, isHidden: false },
            { args: [[1, 1, 1, 1], 2], expected: 1, isHidden: false },
            { args: [[2, 3, 4, 5], 1], expected: 5, isHidden: true }
        ]
    },
    {
        id: 'flpk-16',
        company: 'flipkart',
        category: 'product',
        number: 16,
        title: 'Distinct Subsequences Target Match',
        difficulty: 'Hard',
        topic: 'Dynamic Programming',
        frequency: '86% in Flipkart Onsite',
        context: 'Counting SKU pattern matches inside warehouse scan history',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }, { name: 't', type: 'string' }],
        returnType: 'int',
        description: 'Given two strings `s` and `t`, return the number of distinct subsequences of `s` which equal `t`.',
        constraints: ['1 <= s.length, t.length <= 1000'],
        hint: '1D DP over t backwards: if s[i] == t[j], dp[j + 1] += dp[j].',
        starter: {
            python: 'def solve(s, t):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s, t) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s, t):\n    dp = [0] * (len(t) + 1)\n    dp[0] = 1\n    for ch in s:\n        for j in range(len(t) - 1, -1, -1):\n            if ch == t[j]: dp[j + 1] += dp[j]\n    return dp[len(t)]',
            javascript: 'function solve(s, t) {\n    const dp = new Array(t.length + 1).fill(0);\n    dp[0] = 1;\n    for (const ch of s) {\n        for (let j = t.length - 1; j >= 0; j--) {\n            if (ch === t[j]) dp[j + 1] += dp[j];\n        }\n    }\n    return dp[t.length];\n}'
        },
        testCases: [
            { args: ['rabbbit', 'rabbit'], expected: 3, isHidden: false },
            { args: ['babgbag', 'bag'], expected: 5, isHidden: false },
            { args: ['abc', 'abcd'], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'flpk-17',
        company: 'flipkart',
        category: 'product',
        number: 17,
        title: 'Stock Buy and Sell with Transaction Fee',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        frequency: '87% in Flipkart FinTech',
        context: 'Maximizing seller payout net of per-order marketplace fee',
        fnName: 'solve',
        params: [{ name: 'prices', type: 'int[]' }, { name: 'fee', type: 'int' }],
        returnType: 'int',
        description: 'You may complete as many transactions as you like, but you must pay `fee` for each transaction (buy + sell). Return the maximum total profit.',
        constraints: ['1 <= prices.length <= 5 * 10^4'],
        hint: 'Maintain cash (not holding) and hold (holding) states: cash = max(cash, hold + p - fee); hold = max(hold, cash - p).',
        starter: {
            python: 'def solve(prices, fee):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(prices, fee) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(prices, fee):\n    cash, hold = 0, -prices[0]\n    for p in prices[1:]:\n        cash = max(cash, hold + p - fee)\n        hold = max(hold, cash - p)\n    return cash',
            javascript: 'function solve(prices, fee) {\n    let cash = 0, hold = -prices[0];\n    for (let i = 1; i < prices.length; i++) {\n        cash = Math.max(cash, hold + prices[i] - fee);\n        hold = Math.max(hold, cash - prices[i]);\n    }\n    return cash;\n}'
        },
        testCases: [
            { args: [[1, 3, 2, 8, 4, 9], 2], expected: 8, isHidden: false },
            { args: [[1, 3, 7, 5, 10, 3], 3], expected: 6, isHidden: false },
            { args: [[5], 2], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'flpk-18',
        company: 'flipkart',
        category: 'product',
        number: 18,
        title: 'Maximal Rectangle of 1s in Binary Matrix',
        difficulty: 'Hard',
        topic: 'Monotonic Stack & DP',
        frequency: '89% in Flipkart Grid Finale',
        context: 'Finding largest rectangular storage bay in warehouse floor map',
        fnName: 'solve',
        params: [{ name: 'matrix', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given a `rows x cols` binary `matrix` filled with `0`s and `1`s, find the largest rectangle containing only `1`s and return its area.',
        constraints: ['1 <= rows, cols <= 200'],
        hint: 'Accumulate histogram heights row by row and compute Largest Rectangle in Histogram for each row.',
        starter: {
            python: 'def solve(matrix):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(matrix) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(matrix):\n    if not matrix: return 0\n    cols = len(matrix[0])\n    h = [0] * (cols + 1)\n    best = 0\n    for row in matrix:\n        for c in range(cols):\n            h[c] = h[c] + 1 if row[c] == 1 else 0\n        st = []\n        for i in range(cols + 1):\n            while st and h[st[-1]] > h[i]:\n                height = h[st.pop()]\n                width = i if not st else i - st[-1] - 1\n                best = max(best, height * width)\n            st.append(i)\n    return best',
            javascript: 'function solve(matrix) {\n    if (!matrix.length) return 0;\n    const cols = matrix[0].length;\n    const h = new Array(cols + 1).fill(0);\n    let best = 0;\n    for (const row of matrix) {\n        for (let c = 0; c < cols; c++) h[c] = row[c] === 1 ? h[c] + 1 : 0;\n        const st = [];\n        for (let i = 0; i <= cols; i++) {\n            while (st.length && h[st[st.length - 1]] > h[i]) {\n                const height = h[st.pop()];\n                const w = st.length ? i - st[st.length - 1] - 1 : i;\n                best = Math.max(best, height * w);\n            }\n            st.push(i);\n        }\n    }\n    return best;\n}'
        },
        testCases: [
            { args: [[[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [1, 0, 0, 1, 0]]], expected: 6, isHidden: false },
            { args: [[[0]]], expected: 0, isHidden: false },
            { args: [[[1]]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'flpk-19',
        company: 'flipkart',
        category: 'product',
        number: 19,
        title: 'Minimum Number of Refueling Stops',
        difficulty: 'Hard',
        topic: 'Greedy & Max Heap',
        frequency: '85% in Flipkart Supply Chain',
        context: 'Minimizing EV fleet charging stops along inter-city highway',
        fnName: 'solve',
        params: [{ name: 'target', type: 'int' }, { name: 'startFuel', type: 'int' }, { name: 'stations', type: 'int[][]' }],
        returnType: 'int',
        description: 'A car starts with `startFuel` liters to reach `target` miles away. Along the way `stations[i] = [pos, fuel]` offer fuel. Return the minimum number of refueling stops needed to reach `target`, or `-1` if impossible.',
        constraints: ['0 <= stations.length <= 500'],
        hint: 'Greedily drive as far as current fuel allows, pushing passed station fuels into a max-heap and popping when fuel runs out.',
        starter: {
            python: 'def solve(target, startFuel, stations):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(target, startFuel, stations) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(target, startFuel, stations):\n    import heapq\n    pq = []\n    fuel, stops, i = startFuel, 0, 0\n    while fuel < target:\n        while i < len(stations) and stations[i][0] <= fuel:\n            heapq.heappush(pq, -stations[i][1])\n            i += 1\n        if not pq: return -1\n        fuel += -heapq.heappop(pq)\n        stops += 1\n    return stops',
            javascript: 'function solve(target, startFuel, stations) {\n    const avail = [];\n    let fuel = startFuel, stops = 0, i = 0;\n    while (fuel < target) {\n        while (i < stations.length && stations[i][0] <= fuel) avail.push(stations[i++][1]);\n        if (!avail.length) return -1;\n        avail.sort((a, b) => a - b);\n        fuel += avail.pop();\n        stops++;\n    }\n    return stops;\n}'
        },
        testCases: [
            { args: [100, 10, [[10, 60], [20, 30], [30, 30], [60, 40]]], expected: 2, isHidden: false },
            { args: [100, 1, [[10, 100]]], expected: -1, isHidden: false },
            { args: [1, 1, []], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'flpk-20',
        company: 'flipkart',
        category: 'product',
        number: 20,
        title: 'Minimum Deletions to Make Array Beautiful',
        difficulty: 'Medium',
        topic: 'Greedy',
        frequency: '84% in Flipkart Coding Test',
        context: 'Cleaning adjacent duplicate SKU entries on even-indexed pairs',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'An array is beautiful if its length is even and `nums[i] != nums[i + 1]` for all even `i`. Return the minimum number of elements to delete from `nums` to make it beautiful.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Scan left to right tracking effective length; skip any element that would equal the previous element at an even position. If final length is odd, delete 1 more.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    dels = 0\n    for i in range(len(nums) - 1):\n        if (i - dels) % 2 == 0 and nums[i] == nums[i + 1]:\n            dels += 1\n    if (len(nums) - dels) % 2 == 1: dels += 1\n    return dels',
            javascript: 'function solve(nums) {\n    let dels = 0;\n    for (let i = 0; i < nums.length - 1; i++) {\n        if ((i - dels) % 2 === 0 && nums[i] === nums[i + 1]) dels++;\n    }\n    if ((nums.length - dels) % 2 === 1) dels++;\n    return dels;\n}'
        },
        testCases: [
            { args: [[1, 1, 2, 3, 5]], expected: 1, isHidden: false },
            { args: [[1, 1, 2, 2, 3, 3]], expected: 2, isHidden: false },
            { args: [[1, 2, 3, 4]], expected: 0, isHidden: true }
        ]
    }
];

