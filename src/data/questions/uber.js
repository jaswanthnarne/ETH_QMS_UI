export const UBER_QUESTIONS = [
    {
        id: 'uber-1',
        company: 'uber',
        category: 'product',
        number: 1,
        title: 'Car Pooling Capacity Check',
        difficulty: 'Medium',
        topic: 'Difference Array / Sweep Line',
        frequency: '98% in Uber SDE-1 Phone Screen',
        context: 'Verifying UberPool vehicle seat capacity across overlapping pickup/drop routes',
        fnName: 'solve',
        params: [{ name: 'trips', type: 'int[][]' }, { name: 'capacity', type: 'int' }],
        returnType: 'boolean',
        description: 'Given `trips[i] = [numPassengers, from, to]` and vehicle `capacity`, return `true` if it is possible to pick up and drop off all passengers without exceeding `capacity` at any point.',
        constraints: ['1 <= trips.length <= 1000', '0 <= from < to <= 1000'],
        hint: 'Use a difference array of size 1001: add numPassengers at from and subtract at to, then check prefix sums.',
        starter: {
            python: 'def solve(trips, capacity):\n    # Write your logic here\n    return False',
            javascript: 'function solve(trips, capacity) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(trips, capacity):\n    diff = [0] * 1002\n    for p, f, t in trips:\n        diff[f] += p\n        diff[t] -= p\n    cur = 0\n    for d in diff:\n        cur += d\n        if cur > capacity: return False\n    return True',
            javascript: 'function solve(trips, capacity) {\n    const diff = new Array(1002).fill(0);\n    for (const [p, f, t] of trips) { diff[f] += p; diff[t] -= p; }\n    let cur = 0;\n    for (const d of diff) { cur += d; if (cur > capacity) return false; }\n    return true;\n}'
        },
        testCases: [
            { args: [[[2, 1, 5], [3, 3, 7]], 4], expected: false, isHidden: false },
            { args: [[[2, 1, 5], [3, 3, 7]], 5], expected: true, isHidden: false },
            { args: [[[3, 2, 7], [3, 7, 9], [8, 3, 9]], 11], expected: true, isHidden: true }
        ]
    },
    {
        id: 'uber-2',
        company: 'uber',
        category: 'product',
        number: 2,
        title: 'Cheapest Flights Within K Stops',
        difficulty: 'Medium',
        topic: 'Shortest Path (Bellman-Ford)',
        frequency: '96% in Uber Onsite',
        context: 'Finding lowest-fare multi-hop shuttle route with at most K transfers',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }, { name: 'flights', type: 'int[][]' }, { name: 'src', type: 'int' }, { name: 'dst', type: 'int' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given `n` cities and `flights[i] = [from, to, price]`, return the cheapest price from `src` to `dst` with at most `k` stops, or `-1` if no such route exists.',
        constraints: ['1 <= n <= 100', '0 <= k < n'],
        hint: 'Run k + 1 iterations of Bellman-Ford relaxing edges using a copy of distances from the previous round.',
        starter: {
            python: 'def solve(n, flights, src, dst, k):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(n, flights, src, dst, k) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(n, flights, src, dst, k):\n    INF = 10**9\n    dist = [INF] * n\n    dist[src] = 0\n    for _ in range(k + 1):\n        nd = dist[:]\n        for u, v, w in flights:\n            if dist[u] + w < nd[v]: nd[v] = dist[u] + w\n        dist = nd\n    return -1 if dist[dst] >= INF else dist[dst]',
            javascript: 'function solve(n, flights, src, dst, k) {\n    const INF = 1e9;\n    let dist = new Array(n).fill(INF);\n    dist[src] = 0;\n    for (let i = 0; i <= k; i++) {\n        const nd = [...dist];\n        for (const [u, v, w] of flights) if (dist[u] + w < nd[v]) nd[v] = dist[u] + w;\n        dist = nd;\n    }\n    return dist[dst] >= INF ? -1 : dist[dst];\n}'
        },
        testCases: [
            { args: [4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1], expected: 700, isHidden: false },
            { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1], expected: 200, isHidden: false },
            { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0], expected: 500, isHidden: true }
        ]
    },
    {
        id: 'uber-3',
        company: 'uber',
        category: 'product',
        number: 3,
        title: 'Bus Routes Minimum Transfers',
        difficulty: 'Hard',
        topic: 'BFS Graph',
        frequency: '93% in Uber Maps & Transit',
        context: 'Minimum transit route switches to travel between source and target stops',
        fnName: 'solve',
        params: [{ name: 'routes', type: 'int[][]' }, { name: 'source', type: 'int' }, { name: 'target', type: 'int' }],
        returnType: 'int',
        description: 'Each `routes[i]` is a circular bus route list of stops. Starting at `source` stop, return the least number of buses you must take to reach `target` stop, or `-1` if impossible.',
        constraints: ['1 <= routes.length <= 500'],
        hint: 'Map each stop to the bus route indices passing through it and run BFS over stops/routes.',
        starter: {
            python: 'def solve(routes, source, target):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(routes, source, target) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(routes, source, target):\n    from collections import defaultdict, deque\n    if source == target: return 0\n    stop_to_routes = defaultdict(list)\n    for idx, r in enumerate(routes):\n        for stop in r: stop_to_routes[stop].append(idx)\n    q = deque([(source, 0)])\n    vis_stops, vis_routes = {source}, set()\n    while q:\n        stop, buses = q.popleft()\n        for r_idx in stop_to_routes[stop]:\n            if r_idx in vis_routes: continue\n            vis_routes.add(r_idx)\n            for nxt in routes[r_idx]:\n                if nxt == target: return buses + 1\n                if nxt not in vis_stops:\n                    vis_stops.add(nxt)\n                    q.append((nxt, buses + 1))\n    return -1',
            javascript: 'function solve(routes, source, target) {\n    if (source === target) return 0;\n    const stopToRoutes = new Map();\n    routes.forEach((r, idx) => r.forEach(s => {\n        if (!stopToRoutes.has(s)) stopToRoutes.set(s, []);\n        stopToRoutes.get(s).push(idx);\n    }));\n    const q = [[source, 0]], visStops = new Set([source]), visRoutes = new Set();\n    while (q.length) {\n        const [stop, buses] = q.shift();\n        for (const rIdx of (stopToRoutes.get(stop) || [])) {\n            if (visRoutes.has(rIdx)) continue;\n            visRoutes.add(rIdx);\n            for (const nxt of routes[rIdx]) {\n                if (nxt === target) return buses + 1;\n                if (!visStops.has(nxt)) { visStops.add(nxt); q.push([nxt, buses + 1]); }\n            }\n        }\n    }\n    return -1;\n}'
        },
        testCases: [
            { args: [[[1, 2, 7], [3, 6, 7]], 1, 6], expected: 2, isHidden: false },
            { args: [[[7, 12], [4, 5, 15], [6], [15, 19], [9, 12, 13]], 15, 12], expected: -1, isHidden: false },
            { args: [[[1, 2, 3]], 2, 2], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'uber-4',
        company: 'uber',
        category: 'product',
        number: 4,
        title: 'Minimum Cost to Connect All Cities (MST)',
        difficulty: 'Medium',
        topic: 'Union Find / Kruskal MST',
        frequency: '91% in Uber Dispatch Infrastructure',
        context: 'Connecting regional dispatch hubs with minimum fiber-optic cost',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }, { name: 'connections', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given `n` cities labeled `1` to `n` and `connections[i] = [x, y, cost]`, return the minimum cost to connect all `n` cities so there is a path between every pair, or `-1` if impossible.',
        constraints: ['1 <= n <= 10^4'],
        hint: 'Sort edges by cost ascending and run Kruskal algorithm with Union-Find.',
        starter: {
            python: 'def solve(n, connections):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(n, connections) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(n, connections):\n    parent = list(range(n + 1))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    edges = sorted(connections, key=lambda x: x[2])\n    cost, used = 0, 0\n    for u, v, w in edges:\n        pu, pv = find(u), find(v)\n        if pu != pv:\n            parent[pu] = pv\n            cost += w\n            used += 1\n    return cost if used == n - 1 else -1',
            javascript: 'function solve(n, connections) {\n    const parent = Array.from({ length: n + 1 }, (_, i) => i);\n    const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };\n    const edges = [...connections].sort((a, b) => a[2] - b[2]);\n    let cost = 0, used = 0;\n    for (const [u, v, w] of edges) {\n        const pu = find(u), pv = find(v);\n        if (pu !== pv) { parent[pu] = pv; cost += w; used++; }\n    }\n    return used === n - 1 ? cost : -1;\n}'
        },
        testCases: [
            { args: [3, [[1, 2, 5], [1, 3, 6], [2, 3, 1]]], expected: 6, isHidden: false },
            { args: [4, [[1, 2, 3], [3, 4, 4]]], expected: -1, isHidden: false },
            { args: [1, []], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'uber-5',
        company: 'uber',
        category: 'product',
        number: 5,
        title: 'Walls and Gates Nearest Exit Distance',
        difficulty: 'Medium',
        topic: 'Multi-Source BFS',
        frequency: '90% in Uber Spatial Systems',
        context: 'Computing nearest driver staging zone distance for every city block',
        fnName: 'solve',
        params: [{ name: 'rooms', type: 'int[][]' }],
        returnType: 'int[][]',
        description: 'Given an `m x n` grid `rooms` where `-1` is a wall, `0` is a gate, and `9999` is an empty room, fill each empty room with the distance to its nearest gate (leave `9999` if unreachable).',
        constraints: ['1 <= m, n <= 250'],
        hint: 'Enqueue all gates (0s) simultaneously and run multi-source BFS.',
        starter: {
            python: 'def solve(rooms):\n    # Write your logic here\n    return []',
            javascript: 'function solve(rooms) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(rooms):\n    from collections import deque\n    m, n = len(rooms), len(rooms[0])\n    grid = [r[:] for r in rooms]\n    q = deque()\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == 0: q.append((r, c))\n    while q:\n        r, c = q.popleft()\n        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 9999:\n                grid[nr][nc] = grid[r][c] + 1\n                q.append((nr, nc))\n    return grid',
            javascript: 'function solve(rooms) {\n    const m = rooms.length, n = rooms[0].length;\n    const grid = rooms.map(r => [...r]), q = [];\n    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (grid[r][c] === 0) q.push([r, c]);\n    while (q.length) {\n        const [r, c] = q.shift();\n        for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 9999) {\n                grid[nr][nc] = grid[r][c] + 1; q.push([nr, nc]);\n            }\n        }\n    }\n    return grid;\n}'
        },
        testCases: [
            { args: [[[9999, -1, 0, 9999], [9999, 9999, 9999, -1], [9999, -1, 9999, -1], [0, -1, 9999, 9999]]], expected: [[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]], isHidden: false },
            { args: [[[-1]]], expected: [[-1]], isHidden: false },
            { args: [[[0, 9999]]], expected: [[0, 1]], isHidden: true }
        ]
    },
    {
        id: 'uber-6',
        company: 'uber',
        category: 'product',
        number: 6,
        title: 'Shortest Bridge Between Two Islands',
        difficulty: 'Medium',
        topic: 'DFS + BFS',
        frequency: '89% in Uber Coding Round',
        context: 'Minimum bridge cells to link two disconnected service zones',
        fnName: 'solve',
        params: [{ name: 'grid', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given an `n x n` binary matrix `grid` containing exactly two islands (`1`s), return the smallest number of `0`s you must flip to `1` to connect the two islands.',
        constraints: ['2 <= n <= 100'],
        hint: 'Use DFS to find and mark all cells of the first island into a BFS queue, then expand BFS until hitting the second island.',
        starter: {
            python: 'def solve(grid):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(grid) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(grid):\n    from collections import deque\n    n = len(grid)\n    g = [r[:] for r in grid]\n    q = deque()\n    def dfs(r, c):\n        if r < 0 or r >= n or c < 0 or c >= n or g[r][c] != 1: return\n        g[r][c] = 2\n        q.append((r, c, 0))\n        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)): dfs(r + dr, c + dc)\n    found = False\n    for r in range(n):\n        if found: break\n        for c in range(n):\n            if g[r][c] == 1:\n                dfs(r, c); found = True; break\n    while q:\n        r, c, d = q.popleft()\n        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < n and 0 <= nc < n:\n                if g[nr][nc] == 1: return d\n                if g[nr][nc] == 0: g[nr][nc] = 2; q.append((nr, nc, d + 1))\n    return 0',
            javascript: 'function solve(grid) {\n    const n = grid.length, g = grid.map(r => [...r]), q = [];\n    const dfs = (r, c) => {\n        if (r < 0 || r >= n || c < 0 || c >= n || g[r][c] !== 1) return;\n        g[r][c] = 2; q.push([r, c, 0]);\n        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr, dc]) => dfs(r + dr, c + dc));\n    };\n    outer: for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (g[r][c] === 1) { dfs(r, c); break outer; }\n    while (q.length) {\n        const [r, c, d] = q.shift();\n        for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < n && nc >= 0 && nc < n) {\n                if (g[nr][nc] === 1) return d;\n                if (g[nr][nc] === 0) { g[nr][nc] = 2; q.push([nr, nc, d + 1]); }\n            }\n        }\n    }\n    return 0;\n}'
        },
        testCases: [
            { args: [[[0, 1], [1, 0]]], expected: 1, isHidden: false },
            { args: [[[0, 1, 0], [0, 0, 0], [0, 0, 1]]], expected: 2, isHidden: false },
            { args: [[[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'uber-7',
        company: 'uber',
        category: 'product',
        number: 7,
        title: 'Meeting Scheduler First Common Slot',
        difficulty: 'Medium',
        topic: 'Two Pointers & Sorting',
        frequency: '92% in Uber SDE-1',
        context: 'Finding earliest overlapping window for driver-partner onboarding call',
        fnName: 'solve',
        params: [{ name: 'slots1', type: 'int[][]' }, { name: 'slots2', type: 'int[][]' }, { name: 'duration', type: 'int' }],
        returnType: 'int[]',
        description: 'Given availability time slots `slots1` and `slots2` of two people and a `duration`, return the earliest time slot `[start, start + duration]` that works for both, or `[]` if none exists.',
        constraints: ['1 <= slots1.length, slots2.length <= 10^4'],
        hint: 'Sort both lists by start time and use two pointers checking if min(end1, end2) - max(start1, start2) >= duration.',
        starter: {
            python: 'def solve(slots1, slots2, duration):\n    # Write your logic here\n    return []',
            javascript: 'function solve(slots1, slots2, duration) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(slots1, slots2, duration):\n    s1 = sorted(slots1)\n    s2 = sorted(slots2)\n    i = j = 0\n    while i < len(s1) and j < len(s2):\n        lo = max(s1[i][0], s2[j][0])\n        hi = min(s1[i][1], s2[j][1])\n        if hi - lo >= duration: return [lo, lo + duration]\n        if s1[i][1] < s2[j][1]: i += 1\n        else: j += 1\n    return []',
            javascript: 'function solve(slots1, slots2, duration) {\n    const s1 = [...slots1].sort((a, b) => a[0] - b[0]);\n    const s2 = [...slots2].sort((a, b) => a[0] - b[0]);\n    let i = 0, j = 0;\n    while (i < s1.length && j < s2.length) {\n        const lo = Math.max(s1[i][0], s2[j][0]);\n        const hi = Math.min(s1[i][1], s2[j][1]);\n        if (hi - lo >= duration) return [lo, lo + duration];\n        if (s1[i][1] < s2[j][1]) i++; else j++;\n    }\n    return [];\n}'
        },
        testCases: [
            { args: [[[10, 50], [60, 120], [140, 210]], [[0, 15], [60, 70]], 8], expected: [60, 68], isHidden: false },
            { args: [[[10, 50], [60, 120], [140, 210]], [[0, 15], [60, 70]], 12], expected: [], isHidden: false },
            { args: [[[0, 10]], [[2, 10]], 5], expected: [2, 7], isHidden: true }
        ]
    },
    {
        id: 'uber-8',
        company: 'uber',
        category: 'product',
        number: 8,
        title: 'Task Scheduler II (Sequential Order with Cooldown)',
        difficulty: 'Medium',
        topic: 'Hash Map & Simulation',
        frequency: '88% in Uber Backend OA',
        context: 'Minimum days to execute ordered dispatch tasks respecting per-type cooldown',
        fnName: 'solve',
        params: [{ name: 'tasks', type: 'int[]' }, { name: 'space', type: 'int' }],
        returnType: 'int',
        description: 'Given positive integers `tasks` that MUST be completed in order (1 task per day) and `space` (minimum days between two tasks of the same type), return the minimum total days needed.',
        constraints: ['1 <= tasks.length <= 10^5'],
        hint: 'Track lastDay[task]; on each task, day = max(day + 1, lastDay[task] + space + 1).',
        starter: {
            python: 'def solve(tasks, space):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(tasks, space) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(tasks, space):\n    last = {}\n    day = 0\n    for t in tasks:\n        day += 1\n        if t in last and day <= last[t] + space:\n            day = last[t] + space + 1\n        last[t] = day\n    return day',
            javascript: 'function solve(tasks, space) {\n    const last = new Map();\n    let day = 0;\n    for (const t of tasks) {\n        day++;\n        if (last.has(t) && day <= last.get(t) + space) day = last.get(t) + space + 1;\n        last.set(t, day);\n    }\n    return day;\n}'
        },
        testCases: [
            { args: [[1, 2, 1, 2, 3, 1], 3], expected: 9, isHidden: false },
            { args: [[5, 8, 8, 5], 2], expected: 6, isHidden: false },
            { args: [[1, 2, 3], 5], expected: 3, isHidden: true }
        ]
    },
    {
        id: 'uber-9',
        company: 'uber',
        category: 'product',
        number: 9,
        title: 'Minimum Time to Repair Cars',
        difficulty: 'Medium',
        topic: 'Binary Search on Answer',
        frequency: '87% in Uber Fleet Operations',
        context: 'Assigning fleet maintenance across mechanics of varying rank speeds',
        fnName: 'solve',
        params: [{ name: 'ranks', type: 'int[]' }, { name: 'cars', type: 'int' }],
        returnType: 'int',
        description: 'A mechanic with rank `r` can repair `n` cars in `r * n^2` minutes. All mechanics work simultaneously. Return the minimum time taken to repair all `cars`.',
        constraints: ['1 <= ranks.length <= 10^5', '1 <= cars <= 10^6'],
        hint: 'Binary search time t; mechanic with rank r repairs floor(sqrt(t / r)) cars.',
        starter: {
            python: 'def solve(ranks, cars):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(ranks, cars) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(ranks, cars):\n    import math\n    lo, hi = 1, min(ranks) * cars * cars\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if sum(math.isqrt(mid // r) for r in ranks) >= cars: hi = mid\n        else: lo = mid + 1\n    return lo',
            javascript: 'function solve(ranks, cars) {\n    let lo = 1, hi = Math.min(...ranks) * cars * cars;\n    while (lo < hi) {\n        const mid = Math.floor((lo + hi) / 2);\n        let repaired = 0;\n        for (const r of ranks) repaired += Math.floor(Math.sqrt(mid / r));\n        if (repaired >= cars) hi = mid;\n        else lo = mid + 1;\n    }\n    return lo;\n}'
        },
        testCases: [
            { args: [[4, 2, 3, 1], 10], expected: 16, isHidden: false },
            { args: [[5, 1, 8], 6], expected: 16, isHidden: false },
            { args: [[2], 3], expected: 18, isHidden: true }
        ]
    },
    {
        id: 'uber-10',
        company: 'uber',
        category: 'product',
        number: 10,
        title: 'Minimum Speed to Arrive on Time',
        difficulty: 'Medium',
        topic: 'Binary Search',
        frequency: '86% in Uber Routing Engine',
        context: 'Computing minimum constant speed across multi-leg train commutes',
        fnName: 'solve',
        params: [{ name: 'dist', type: 'int[]' }, { name: 'hour', type: 'float' }],
        returnType: 'int',
        description: 'You must take `n` rides of distances `dist[i]` in order. Each ride except the last must depart on an integer hour (ceil of travel time). Return the minimum positive integer speed (km/h) to arrive within `hour`, or `-1` if impossible.',
        constraints: ['1 <= dist.length <= 10^5'],
        hint: 'Binary search speed in [1, 10^7]. Note the last segment does not get rounded up.',
        starter: {
            python: 'def solve(dist, hour):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(dist, hour) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(dist, hour):\n    import math\n    if hour <= len(dist) - 1: return -1\n    lo, hi = 1, 10**7\n    while lo < hi:\n        mid = (lo + hi) // 2\n        t = sum(math.ceil(d / mid) for d in dist[:-1]) + dist[-1] / mid\n        if t <= hour: hi = mid\n        else: lo = mid + 1\n    return lo',
            javascript: 'function solve(dist, hour) {\n    if (hour <= dist.length - 1) return -1;\n    let lo = 1, hi = 10000000;\n    while (lo < hi) {\n        const mid = (lo + hi) >> 1;\n        let t = 0;\n        for (let i = 0; i < dist.length - 1; i++) t += Math.ceil(dist[i] / mid);\n        t += dist[dist.length - 1] / mid;\n        if (t <= hour) hi = mid; else lo = mid + 1;\n    }\n    return lo;\n}'
        },
        testCases: [
            { args: [[1, 3, 2], 6], expected: 1, isHidden: false },
            { args: [[1, 3, 2], 2.7], expected: 3, isHidden: false },
            { args: [[1, 3, 2], 1.9], expected: -1, isHidden: true }
        ]
    },
    {
        id: 'uber-11',
        company: 'uber',
        category: 'product',
        number: 11,
        title: 'Minimum Cost For Tickets (1, 7, 30-Day Passes)',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        frequency: '88% in Uber Pass Pricing',
        context: 'Selecting cheapest combination of 1-day, 7-day, and 30-day ride passes',
        fnName: 'solve',
        params: [{ name: 'days', type: 'int[]' }, { name: 'costs', type: 'int[]' }],
        returnType: 'int',
        description: 'Given sorted travel `days` (1..365) and `costs = [1-day, 7-day, 30-day]` pass prices, return the minimum cost to cover every travel day.',
        constraints: ['1 <= days.length <= 365'],
        hint: 'DP over days 1..lastDay: if not traveling on d, dp[d] = dp[d-1]; else min of 1, 7, 30 day pass transitions.',
        starter: {
            python: 'def solve(days, costs):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(days, costs) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(days, costs):\n    travel = set(days)\n    last = days[-1]\n    dp = [0] * (last + 1)\n    for d in range(1, last + 1):\n        if d not in travel: dp[d] = dp[d - 1]\n        else:\n            dp[d] = min(dp[d - 1] + costs[0], dp[max(0, d - 7)] + costs[1], dp[max(0, d - 30)] + costs[2])\n    return dp[last]',
            javascript: 'function solve(days, costs) {\n    const travel = new Set(days), last = days[days.length - 1];\n    const dp = new Array(last + 1).fill(0);\n    for (let d = 1; d <= last; d++) {\n        if (!travel.has(d)) dp[d] = dp[d - 1];\n        else dp[d] = Math.min(dp[d - 1] + costs[0], dp[Math.max(0, d - 7)] + costs[1], dp[Math.max(0, d - 30)] + costs[2]);\n    }\n    return dp[last];\n}'
        },
        testCases: [
            { args: [[1, 4, 6, 7, 8, 20], [2, 7, 15]], expected: 11, isHidden: false },
            { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 30, 31], [2, 7, 15]], expected: 17, isHidden: false },
            { args: [[1], [5, 20, 50]], expected: 5, isHidden: true }
        ]
    },
    {
        id: 'uber-12',
        company: 'uber',
        category: 'product',
        number: 12,
        title: 'Longest Continuous Subarray With Abs Diff <= Limit',
        difficulty: 'Medium',
        topic: 'Sliding Window & Monotonic Deque',
        frequency: '90% in Uber Surge Pricing Monitor',
        context: 'Longest steady fare window where max - min <= surge tolerance',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }, { name: 'limit', type: 'int' }],
        returnType: 'int',
        description: 'Given an array of integers `nums` and an integer `limit`, return the size of the longest non-empty subarray such that the absolute difference between any two elements is less than or equal to `limit`.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Maintain two monotonic deques (one for window max, one for window min) and shrink left when max - min > limit.',
        starter: {
            python: 'def solve(nums, limit):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums, limit) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums, limit):\n    from collections import deque\n    maxd, mind = deque(), deque()\n    l = best = 0\n    for r, x in enumerate(nums):\n        while maxd and maxd[-1] < x: maxd.pop()\n        while mind and mind[-1] > x: mind.pop()\n        maxd.append(x); mind.append(x)\n        while maxd[0] - mind[0] > limit:\n            if maxd[0] == nums[l]: maxd.popleft()\n            if mind[0] == nums[l]: mind.popleft()\n            l += 1\n        best = max(best, r - l + 1)\n    return best',
            javascript: 'function solve(nums, limit) {\n    const maxd = [], mind = [];\n    let l = 0, best = 0;\n    for (let r = 0; r < nums.length; r++) {\n        const x = nums[r];\n        while (maxd.length && maxd[maxd.length - 1] < x) maxd.pop();\n        while (mind.length && mind[mind.length - 1] > x) mind.pop();\n        maxd.push(x); mind.push(x);\n        while (maxd[0] - mind[0] > limit) {\n            if (maxd[0] === nums[l]) maxd.shift();\n            if (mind[0] === nums[l]) mind.shift();\n            l++;\n        }\n        best = Math.max(best, r - l + 1);\n    }\n    return best;\n}'
        },
        testCases: [
            { args: [[8, 2, 4, 7], 4], expected: 2, isHidden: false },
            { args: [[10, 1, 2, 4, 7, 2], 5], expected: 4, isHidden: false },
            { args: [[4, 2, 2, 2, 4, 4, 2, 2], 0], expected: 3, isHidden: true }
        ]
    },
    {
        id: 'uber-13',
        company: 'uber',
        category: 'product',
        number: 13,
        title: 'Find the City With Smallest Number of Reachable Neighbors',
        difficulty: 'Medium',
        topic: 'Floyd-Warshall / Shortest Path',
        frequency: '87% in Uber City Graph Team',
        context: 'Selecting hub city with fewest reachable zones within distance threshold',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }, { name: 'edges', type: 'int[][]' }, { name: 'distanceThreshold', type: 'int' }],
        returnType: 'int',
        description: 'Given `n` cities (`0..n-1`) and undirected weighted `edges[i] = [u, v, w]`, return the city with the smallest number of other cities reachable at distance `<= distanceThreshold`. Break ties by returning the city with the greatest ID.',
        constraints: ['2 <= n <= 100'],
        hint: 'Run Floyd-Warshall all-pairs shortest paths and count neighbors within distanceThreshold for each city.',
        starter: {
            python: 'def solve(n, edges, distanceThreshold):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(n, edges, distanceThreshold) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(n, edges, distanceThreshold):\n    INF = 10**9\n    dist = [[INF] * n for _ in range(n)]\n    for i in range(n): dist[i][i] = 0\n    for u, v, w in edges:\n        dist[u][v] = min(dist[u][v], w)\n        dist[v][u] = min(dist[v][u], w)\n    for k in range(n):\n        for i in range(n):\n            for j in range(n):\n                if dist[i][k] + dist[k][j] < dist[i][j]:\n                    dist[i][j] = dist[i][k] + dist[k][j]\n    best_city, best_cnt = -1, n + 1\n    for i in range(n):\n        cnt = sum(1 for j in range(n) if i != j and dist[i][j] <= distanceThreshold)\n        if cnt <= best_cnt:\n            best_cnt = cnt; best_city = i\n    return best_city',
            javascript: 'function solve(n, edges, distanceThreshold) {\n    const INF = 1e9;\n    const dist = Array.from({ length: n }, () => new Array(n).fill(INF));\n    for (let i = 0; i < n; i++) dist[i][i] = 0;\n    for (const [u, v, w] of edges) { dist[u][v] = Math.min(dist[u][v], w); dist[v][u] = Math.min(dist[v][u], w); }\n    for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {\n        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];\n    }\n    let bestCity = -1, bestCnt = n + 1;\n    for (let i = 0; i < n; i++) {\n        let cnt = 0;\n        for (let j = 0; j < n; j++) if (i !== j && dist[i][j] <= distanceThreshold) cnt++;\n        if (cnt <= bestCnt) { bestCnt = cnt; bestCity = i; }\n    }\n    return bestCity;\n}'
        },
        testCases: [
            { args: [4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4], expected: 3, isHidden: false },
            { args: [5, [[0, 1, 2], [0, 4, 8], [1, 2, 3], [1, 4, 2], [2, 3, 1], [3, 4, 1]], 2], expected: 0, isHidden: false },
            { args: [2, [[0, 1, 10]], 5], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'uber-14',
        company: 'uber',
        category: 'product',
        number: 14,
        title: 'Minimum Operations to Make Network Connected',
        difficulty: 'Medium',
        topic: 'Union Find',
        frequency: '86% in Uber Cloud Networking',
        context: 'Rewiring redundant regional links to connect all dispatch clusters',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }, { name: 'connections', type: 'int[][]' }],
        returnType: 'int',
        description: 'There are `n` computers numbered `0` to `n - 1` connected by ethernet cables `connections`. You can extract any redundant cable and reconnect two disconnected computers. Return the minimum operations to connect all computers, or `-1` if impossible.',
        constraints: ['1 <= n <= 10^5'],
        hint: 'If len(connections) < n - 1, return -1. Otherwise count connected components C using Union-Find; answer is C - 1.',
        starter: {
            python: 'def solve(n, connections):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(n, connections) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(n, connections):\n    if len(connections) < n - 1: return -1\n    p = list(range(n))\n    def find(x):\n        while p[x] != x:\n            p[x] = p[p[x]]; x = p[x]\n        return x\n    comp = n\n    for u, v in connections:\n        pu, pv = find(u), find(v)\n        if pu != pv: p[pu] = pv; comp -= 1\n    return comp - 1',
            javascript: 'function solve(n, connections) {\n    if (connections.length < n - 1) return -1;\n    const p = Array.from({ length: n }, (_, i) => i);\n    const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };\n    let comp = n;\n    for (const [u, v] of connections) {\n        const pu = find(u), pv = find(v);\n        if (pu !== pv) { p[pu] = pv; comp--; }\n    }\n    return comp - 1;\n}'
        },
        testCases: [
            { args: [4, [[0, 1], [0, 2], [1, 2]]], expected: 1, isHidden: false },
            { args: [6, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]]], expected: 2, isHidden: false },
            { args: [6, [[0, 1], [0, 2], [0, 3], [1, 2]]], expected: -1, isHidden: true }
        ]
    },
    {
        id: 'uber-15',
        company: 'uber',
        category: 'product',
        number: 15,
        title: 'Maximum Number of Events That Can Be Attended',
        difficulty: 'Medium',
        topic: 'Greedy & Min Heap',
        frequency: '88% in Uber Marketplace Scheduling',
        context: 'Maximizing driver bonus promos attended with one promo per day',
        fnName: 'solve',
        params: [{ name: 'events', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given `events[i] = [startDay, endDay]`, you can attend at most one event per day on any day `d` where `startDay <= d <= endDay`. Return the maximum number of events you can attend.',
        constraints: ['1 <= events.length <= 10^5'],
        hint: 'Sort events by startDay. For each day, add active events to a min-heap of endDays, pop expired ones, and attend the one ending soonest.',
        starter: {
            python: 'def solve(events):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(events) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(events):\n    import heapq\n    ev = sorted(events)\n    pq = []\n    i = ans = day = 0\n    n = len(ev)\n    while i < n or pq:\n        if not pq: day = ev[i][0]\n        while i < n and ev[i][0] <= day:\n            heapq.heappush(pq, ev[i][1])\n            i += 1\n        heapq.heappop(pq)\n        ans += 1\n        day += 1\n        while pq and pq[0] < day: heapq.heappop(pq)\n    return ans',
            javascript: 'function solve(events) {\n    const ev = [...events].sort((a, b) => a[0] - b[0]);\n    const ends = [];\n    let i = 0, ans = 0, day = 0;\n    while (i < ev.length || ends.length) {\n        if (!ends.length) day = ev[i][0];\n        while (i < ev.length && ev[i][0] <= day) ends.push(ev[i++][1]);\n        ends.sort((a, b) => a - b);\n        ends.shift();\n        ans++; day++;\n        while (ends.length && ends[0] < day) ends.shift();\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[[1, 2], [2, 3], [3, 4]]], expected: 3, isHidden: false },
            { args: [[[1, 2], [2, 3], [3, 4], [1, 2]]], expected: 4, isHidden: false },
            { args: [[[1, 1], [1, 1]]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'uber-16',
        company: 'uber',
        category: 'product',
        number: 16,
        title: 'Minimum Area Rectangle From Axis-Aligned Points',
        difficulty: 'Medium',
        topic: 'Hash Set & Geometry',
        frequency: '85% in Uber Geo-Indexing',
        context: 'Computing smallest bounding geofence box formed by 4 pickup pins',
        fnName: 'solve',
        params: [{ name: 'points', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given a list of 2D `points`, return the minimum area of an axis-aligned rectangle formed from any 4 points, or `0` if no rectangle exists.',
        constraints: ['1 <= points.length <= 500'],
        hint: 'Store all points in a set; iterate pairs (x1, y1) and (x2, y2) with x1 != x2 and y1 != y2, and check if (x1, y2) and (x2, y1) exist.',
        starter: {
            python: 'def solve(points):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(points) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(points):\n    pset = {(x, y) for x, y in points}\n    best = float("inf")\n    n = len(points)\n    for i in range(n):\n        x1, y1 = points[i]\n        for j in range(i + 1, n):\n            x2, y2 = points[j]\n            if x1 != x2 and y1 != y2 and (x1, y2) in pset and (x2, y1) in pset:\n                best = min(best, abs(x1 - x2) * abs(y1 - y2))\n    return 0 if best == float("inf") else best',
            javascript: 'function solve(points) {\n    const pset = new Set(points.map(([x, y]) => `${x},${y}`));\n    let best = Infinity;\n    for (let i = 0; i < points.length; i++) {\n        const [x1, y1] = points[i];\n        for (let j = i + 1; j < points.length; j++) {\n            const [x2, y2] = points[j];\n            if (x1 !== x2 && y1 !== y2 && pset.has(`${x1},${y2}`) && pset.has(`${x2},${y1}`)) {\n                best = Math.min(best, Math.abs(x1 - x2) * Math.abs(y1 - y2));\n            }\n        }\n    }\n    return best === Infinity ? 0 : best;\n}'
        },
        testCases: [
            { args: [[[1, 1], [1, 3], [3, 1], [3, 3], [2, 2]]], expected: 4, isHidden: false },
            { args: [[[1, 1], [1, 3], [3, 1], [3, 3], [4, 1], [4, 3]]], expected: 2, isHidden: false },
            { args: [[[0, 0], [1, 1]]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'uber-17',
        company: 'uber',
        category: 'product',
        number: 17,
        title: 'Minimum Window Subsequence (Order Preserved)',
        difficulty: 'Hard',
        topic: 'Two Pointers / DP',
        frequency: '84% in Uber Trip Pattern Matching',
        context: 'Finding shortest GPS breadcrumb slice matching ordered checkpoint sequence',
        fnName: 'solve',
        params: [{ name: 's1', type: 'string' }, { name: 's2', type: 'string' }],
        returnType: 'string',
        description: 'Given strings `s1` and `s2`, return the minimum contiguous substring `W` of `s1` such that `s2` is a subsequence of `W` (if tied, return the leftmost). Return `""` if none exists.',
        constraints: ['1 <= s1.length <= 2 * 10^4', '1 <= s2.length <= 100'],
        hint: 'Forward scan s1 to match s2; once matched, backward scan from match end to tighten the start boundary.',
        starter: {
            python: 'def solve(s1, s2):\n    # Write your logic here\n    return ""',
            javascript: 'function solve(s1, s2) {\n    // Write your logic here\n    return "";\n}'
        },
        solution: {
            python: 'def solve(s1, s2):\n    n, m = len(s1), len(s2)\n    best_len, best_l = n + 1, 0\n    i = 0\n    while i < n:\n        j = 0\n        while i < n:\n            if s1[i] == s2[j]:\n                j += 1\n                if j == m: break\n            i += 1\n        if j < m: break\n        end = i\n        j = m - 1\n        while j >= 0:\n            if s1[i] == s2[j]: j -= 1\n            i -= 1\n        i += 1\n        if end - i + 1 < best_len:\n            best_len = end - i + 1; best_l = i\n        i += 1\n    return "" if best_len > n else s1[best_l:best_l + best_len]',
            javascript: 'function solve(s1, s2) {\n    const n = s1.length, m = s2.length;\n    let bestLen = n + 1, bestL = 0, i = 0;\n    while (i < n) {\n        let j = 0;\n        while (i < n) { if (s1[i] === s2[j]) { j++; if (j === m) break; } i++; }\n        if (j < m) break;\n        const end = i;\n        j = m - 1;\n        while (j >= 0) { if (s1[i] === s2[j]) j--; i--; }\n        i++;\n        if (end - i + 1 < bestLen) { bestLen = end - i + 1; bestL = i; }\n        i++;\n    }\n    return bestLen > n ? "" : s1.slice(bestL, bestL + bestLen);\n}'
        },
        testCases: [
            { args: ['abcdebdde', 'bde'], expected: 'bcde', isHidden: false },
            { args: ['jmeqksfrsdcmsiwvaovztaqenprpvnbstl', 'u'], expected: '', isHidden: false },
            { args: ['fgrqsqsnodwmxzkzxwqegkndaa', 'fnok'], expected: 'fgrqsqsnodwmxzk', isHidden: true }
        ]
    },
    {
        id: 'uber-18',
        company: 'uber',
        category: 'product',
        number: 18,
        title: 'Minimum Time Difference to Complete Tasks (Job Difficulty)',
        difficulty: 'Medium',
        topic: 'Prefix Sum & Binary Search',
        frequency: '85% in Uber Pricing Engine',
        context: 'Splitting trip route into K segments minimizing max segment cost',
        fnName: 'solve',
        params: [{ name: 'weights', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given non-negative integers `weights` representing ride legs and `k` drivers, partition `weights` into at most `k` contiguous non-empty subarrays to minimize the largest subarray sum.',
        constraints: ['1 <= k <= weights.length <= 10^4'],
        hint: 'Binary search the maximum allowed subarray sum in [max(weights), sum(weights)].',
        starter: {
            python: 'def solve(weights, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(weights, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(weights, k):\n    def can(cap):\n        parts, cur = 1, 0\n        for w in weights:\n            if cur + w > cap: parts += 1; cur = w\n            else: cur += w\n        return parts <= k\n    lo, hi = max(weights), sum(weights)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if can(mid): hi = mid\n        else: lo = mid + 1\n    return lo',
            javascript: 'function solve(weights, k) {\n    const can = (cap) => {\n        let parts = 1, cur = 0;\n        for (const w of weights) { if (cur + w > cap) { parts++; cur = w; } else cur += w; }\n        return parts <= k;\n    };\n    let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);\n    while (lo < hi) {\n        const mid = Math.floor((lo + hi) / 2);\n        if (can(mid)) hi = mid; else lo = mid + 1;\n    }\n    return lo;\n}'
        },
        testCases: [
            { args: [[7, 2, 5, 10, 8], 2], expected: 18, isHidden: false },
            { args: [[1, 2, 3, 4, 5], 2], expected: 9, isHidden: false },
            { args: [[1, 4, 4], 3], expected: 4, isHidden: true }
        ]
    },
    {
        id: 'uber-19',
        company: 'uber',
        category: 'product',
        number: 19,
        title: 'Minimum Moves to Equal Array Elements (Increment N-1)',
        difficulty: 'Medium',
        topic: 'Math',
        frequency: '83% in Uber Screening',
        context: 'Balancing ride incentive credits across N driver zones',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer array `nums` of size `n`, in one move you increment `n - 1` elements by `1`. Return the minimum number of moves required to make all array elements equal.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Incrementing n - 1 elements by 1 is equivalent to decrementing 1 element by 1. Answer = sum(nums) - n * min(nums).',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    return sum(nums) - len(nums) * min(nums)',
            javascript: 'function solve(nums) {\n    const mn = Math.min(...nums);\n    return nums.reduce((acc, x) => acc + (x - mn), 0);\n}'
        },
        testCases: [
            { args: [[1, 2, 3]], expected: 3, isHidden: false },
            { args: [[1, 1, 1]], expected: 0, isHidden: false },
            { args: [[5, 6, 8, 8, 5]], expected: 7, isHidden: true }
        ]
    },
    {
        id: 'uber-20',
        company: 'uber',
        category: 'product',
        number: 20,
        title: 'Number of Distinct Islands',
        difficulty: 'Medium',
        topic: 'DFS & Path Signature',
        frequency: '91% in Uber Geo-Spatial Round',
        context: 'Deduplicating identically shaped coverage polygons on city map',
        fnName: 'solve',
        params: [{ name: 'grid', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given an `m x n` binary matrix `grid`, an island is a 4-directionally connected group of `1`s. Two islands are considered the same if one can be translated (shifted without rotating) to equal the other. Return the number of distinct islands.',
        constraints: ['1 <= m, n <= 50'],
        hint: 'Record the relative (r - r0, c - c0) coordinates of each island cell in a canonical tuple/string and store in a set.',
        starter: {
            python: 'def solve(grid):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(grid) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(grid):\n    m, n = len(grid), len(grid[0])\n    g = [r[:] for r in grid]\n    shapes = set()\n    def dfs(r, c, r0, c0, path):\n        if r < 0 or r >= m or c < 0 or c >= n or g[r][c] != 1: return\n        g[r][c] = 0\n        path.append((r - r0, c - c0))\n        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)): dfs(r + dr, c + dc, r0, c0, path)\n    for r in range(m):\n        for c in range(n):\n            if g[r][c] == 1:\n                p = []\n                dfs(r, c, r, c, p)\n                shapes.add(tuple(p))\n    return len(shapes)',
            javascript: 'function solve(grid) {\n    const m = grid.length, n = grid[0].length, g = grid.map(r => [...r]), shapes = new Set();\n    const dfs = (r, c, r0, c0, path) => {\n        if (r < 0 || r >= m || c < 0 || c >= n || g[r][c] !== 1) return;\n        g[r][c] = 0;\n        path.push(`${r - r0}:${c - c0}`);\n        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr, dc]) => dfs(r + dr, c + dc, r0, c0, path));\n    };\n    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (g[r][c] === 1) {\n        const p = []; dfs(r, c, r, c, p); shapes.add(p.join(","));\n    }\n    return shapes.size;\n}'
        },
        testCases: [
            { args: [[[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 0, 1, 1], [0, 0, 0, 1, 1]]], expected: 1, isHidden: false },
            { args: [[[1, 1, 0, 1, 1], [1, 0, 0, 0, 0], [0, 0, 0, 0, 1], [1, 1, 0, 1, 1]]], expected: 3, isHidden: false },
            { args: [[[0, 0], [0, 0]]], expected: 0, isHidden: true }
        ]
    }
];

