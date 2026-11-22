export const NETFLIX_QUESTIONS = [
    {
        id: 'nflx-1',
        company: 'netflix',
        category: 'product',
        number: 1,
        title: 'Group Similar Movie Titles',
        difficulty: 'Medium',
        topic: 'Hash Map & Strings',
        frequency: '94% in Netflix Content Discovery Round',
        context: 'Grouping misspelled user searches with identical character counts',
        fnName: 'solve',
        params: [{ name: 'titles', type: 'string[]' }, { name: 'query', type: 'string' }],
        returnType: 'string[]',
        description: 'Given a list of movie `titles` and a search `query`, return all titles from `titles` that are anagrams of `query` (preserving their original order).',
        constraints: ['1 <= titles.length <= 10^4'],
        hint: 'Compute a 26-character frequency signature for query and match against each title.',
        starter: {
            python: 'def solve(titles, query):\n    # Write your logic here\n    return []',
            javascript: 'function solve(titles, query) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(titles, query):\n    key = sorted(query)\n    return [t for t in titles if sorted(t) == key]',
            javascript: 'function solve(titles, query) {\n    const key = [...query].sort().join("");\n    return titles.filter(t => [...t].sort().join("") === key);\n}'
        },
        testCases: [
            { args: [['duel', 'dule', 'speed', 'spede', 'deul'], 'dule'], expected: ['duel', 'dule', 'deul'], isHidden: false },
            { args: [['speed', 'spede', 'deul'], 'despe'], expected: ['speed', 'spede'], isHidden: false },
            { args: [['abc', 'def'], 'xyz'], expected: [], isHidden: true }
        ]
    },
    {
        id: 'nflx-2',
        company: 'netflix',
        category: 'product',
        number: 2,
        title: 'Fetch Most Recently Watched Titles (LFU/LRU)',
        difficulty: 'Medium',
        topic: 'Design & Hashing',
        frequency: '93% in Netflix Playback Team',
        context: 'Tracking active Continue Watching titles in fixed cache slots',
        fnName: 'solve',
        params: [{ name: 'capacity', type: 'int' }, { name: 'ops', type: 'string[]' }],
        returnType: 'int[]',
        description: 'Simulate a cache of `capacity` where `"put:id"` marks a movie ID as most recently watched (evicting least recently watched if full) and `"get:id"` returns its position from most-recent (`0`-indexed) or `-1` if not cached (also moving it to most-recent if found). Return results of all `"get"` operations.',
        constraints: ['1 <= capacity <= 100'],
        hint: 'Maintain an ordered array/list or OrderedDict where accesses move the item to the front.',
        starter: {
            python: 'def solve(capacity, ops):\n    # Write your logic here\n    return []',
            javascript: 'function solve(capacity, ops) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(capacity, ops):\n    cache = []\n    out = []\n    for op in ops:\n        kind, val = op.split(":")\n        mid = int(val)\n        if kind == "put":\n            if mid in cache: cache.remove(mid)\n            elif len(cache) == capacity: cache.pop()\n            cache.insert(0, mid)\n        else:\n            if mid not in cache:\n                out.append(-1)\n            else:\n                pos = cache.index(mid)\n                out.append(pos)\n                cache.pop(pos)\n                cache.insert(0, mid)\n    return out',
            javascript: 'function solve(capacity, ops) {\n    const cache = [], out = [];\n    for (const op of ops) {\n        const [kind, val] = op.split(":");\n        const mid = Number(val);\n        if (kind === "put") {\n            const idx = cache.indexOf(mid);\n            if (idx !== -1) cache.splice(idx, 1);\n            else if (cache.length === capacity) cache.pop();\n            cache.unshift(mid);\n        } else {\n            const idx = cache.indexOf(mid);\n            if (idx === -1) out.push(-1);\n            else { out.push(idx); cache.splice(idx, 1); cache.unshift(mid); }\n        }\n    }\n    return out;\n}'
        },
        testCases: [
            { args: [2, ['put:1', 'put:2', 'get:1', 'put:3', 'get:2', 'get:3']], expected: [1, -1, 0], isHidden: false },
            { args: [1, ['put:10', 'get:10', 'put:20', 'get:10']], expected: [0, -1], isHidden: false },
            { args: [2, ['get:5', 'put:5', 'get:5']], expected: [-1, 0], isHidden: true }
        ]
    },
    {
        id: 'nflx-3',
        company: 'netflix',
        category: 'product',
        number: 3,
        title: 'Browse History Max Rating Stack',
        difficulty: 'Easy',
        topic: 'Stack',
        frequency: '89% in Netflix UI Platform',
        context: 'Tracking peak user-rated title in current browsing session',
        fnName: 'solve',
        params: [{ name: 'ops', type: 'string[]' }],
        returnType: 'int[]',
        description: 'Given operations `"push:x"` (push rating `x`), `"pop"` (remove top), and `"max"` (record current maximum rating in stack), return an array of outputs for every `"max"` operation.',
        constraints: ['1 <= ops.length <= 10^4'],
        hint: 'Maintain an auxiliary monotonic max-stack alongside the main stack.',
        starter: {
            python: 'def solve(ops):\n    # Write your logic here\n    return []',
            javascript: 'function solve(ops) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(ops):\n    st, mx, out = [], [], []\n    for op in ops:\n        if op.startswith("push:"):\n            v = int(op.split(":")[1])\n            st.append(v)\n            mx.append(v if not mx else max(mx[-1], v))\n        elif op == "pop" and st:\n            st.pop(); mx.pop()\n        elif op == "max" and mx:\n            out.append(mx[-1])\n    return out',
            javascript: 'function solve(ops) {\n    const st = [], mx = [], out = [];\n    for (const op of ops) {\n        if (op.startsWith("push:")) {\n            const v = Number(op.split(":")[1]);\n            st.push(v);\n            mx.push(mx.length ? Math.max(mx[mx.length - 1], v) : v);\n        } else if (op === "pop" && st.length) { st.pop(); mx.pop(); }\n        else if (op === "max" && mx.length) out.push(mx[mx.length - 1]);\n    }\n    return out;\n}'
        },
        testCases: [
            { args: [['push:5', 'push:2', 'max', 'push:8', 'max', 'pop', 'max']], expected: [5, 8, 5], isHidden: false },
            { args: [['push:3', 'push:3', 'pop', 'max']], expected: [3], isHidden: false },
            { args: [['push:10', 'max']], expected: [10], isHidden: true }
        ]
    },
    {
        id: 'nflx-4',
        company: 'netflix',
        category: 'product',
        number: 4,
        title: 'Verify User Viewing Session Stack',
        difficulty: 'Medium',
        topic: 'Stack Simulation',
        frequency: '90% in Netflix Streaming Core',
        context: 'Validating pushed and popped video player state transitions',
        fnName: 'solve',
        params: [{ name: 'pushed', type: 'int[]' }, { name: 'popped', type: 'int[]' }],
        returnType: 'boolean',
        description: 'Given two integer arrays `pushed` and `popped` each with distinct values, return `true` if this could have been the result of a sequence of push and pop operations on an initially empty stack.',
        constraints: ['1 <= pushed.length <= 1000'],
        hint: 'Simulate pushing elements of pushed; after each push, pop while stack top equals popped[j].',
        starter: {
            python: 'def solve(pushed, popped):\n    # Write your logic here\n    return False',
            javascript: 'function solve(pushed, popped) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(pushed, popped):\n    st = []\n    j = 0\n    for x in pushed:\n        st.append(x)\n        while st and j < len(popped) and st[-1] == popped[j]:\n            st.pop(); j += 1\n    return j == len(popped)',
            javascript: 'function solve(pushed, popped) {\n    const st = [];\n    let j = 0;\n    for (const x of pushed) {\n        st.push(x);\n        while (st.length && j < popped.length && st[st.length - 1] === popped[j]) {\n            st.pop(); j++;\n        }\n    }\n    return j === popped.length;\n}'
        },
        testCases: [
            { args: [[1, 2, 3, 4, 5], [4, 5, 3, 2, 1]], expected: true, isHidden: false },
            { args: [[1, 2, 3, 4, 5], [4, 3, 5, 1, 2]], expected: false, isHidden: false },
            { args: [[1, 0], [1, 0]], expected: true, isHidden: true }
        ]
    },
    {
        id: 'nflx-5',
        company: 'netflix',
        category: 'product',
        number: 5,
        title: 'Merge Streaming Video Segments',
        difficulty: 'Medium',
        topic: 'Intervals',
        frequency: '92% in Netflix Video Encoding',
        context: 'Coalescing buffered CDN byte-range chunks into contiguous spans',
        fnName: 'solve',
        params: [{ name: 'segments', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given a list of downloaded video byte-range intervals `segments` `[start, end]`, merge all overlapping intervals and return the total unique bytes covered (where `[start, end]` covers `end - start` bytes).',
        constraints: ['1 <= segments.length <= 10^4'],
        hint: 'Sort segments by start, merge overlapping intervals, and sum (end - start).',
        starter: {
            python: 'def solve(segments):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(segments) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(segments):\n    segs = sorted(segments)\n    merged = []\n    for s, e in segs:\n        if not merged or s > merged[-1][1]:\n            merged.append([s, e])\n        else:\n            merged[-1][1] = max(merged[-1][1], e)\n    return sum(e - s for s, e in merged)',
            javascript: 'function solve(segments) {\n    const segs = [...segments].sort((a, b) => a[0] - b[0]);\n    const merged = [];\n    for (const [s, e] of segs) {\n        if (!merged.length || s > merged[merged.length - 1][1]) merged.push([s, e]);\n        else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);\n    }\n    return merged.reduce((acc, [s, e]) => acc + (e - s), 0);\n}'
        },
        testCases: [
            { args: [[[1, 4], [2, 6], [8, 10]]], expected: 7, isHidden: false },
            { args: [[[0, 10], [2, 5]]], expected: 10, isHidden: false },
            { args: [[[1, 2], [3, 5]]], expected: 3, isHidden: true }
        ]
    },
    {
        id: 'nflx-6',
        company: 'netflix',
        category: 'product',
        number: 6,
        title: 'Reorganize Playlist Without Adjacent Duplicates',
        difficulty: 'Medium',
        topic: 'Greedy & Heap',
        frequency: '91% in Netflix Recommendation Engine',
        context: 'Ordering episodes so two from the same genre never play back-to-back',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'boolean',
        description: 'Given a string `s` representing genre tags of queued episodes, return `true` if the characters of `s` can be rearranged so that no two adjacent characters are identical.',
        constraints: ['1 <= s.length <= 5000'],
        hint: 'A valid rearrangement exists if and only if maxCharFreq <= (len(s) + 1) // 2.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return False',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(s):\n    from collections import Counter\n    max_f = max(Counter(s).values())\n    return max_f <= (len(s) + 1) // 2',
            javascript: 'function solve(s) {\n    const cnt = new Map();\n    let maxF = 0;\n    for (const ch of s) {\n        const f = (cnt.get(ch) || 0) + 1;\n        cnt.set(ch, f);\n        if (f > maxF) maxF = f;\n    }\n    return maxF <= Math.floor((s.length + 1) / 2);\n}'
        },
        testCases: [
            { args: ['aab'], expected: true, isHidden: false },
            { args: ['aaab'], expected: false, isHidden: false },
            { args: ['vvvlo'], expected: true, isHidden: true }
        ]
    },
    {
        id: 'nflx-7',
        company: 'netflix',
        category: 'product',
        number: 7,
        title: 'Partition Labels into Independent Episodes',
        difficulty: 'Medium',
        topic: 'Greedy & Two Pointers',
        frequency: '88% in Netflix Media Pipeline',
        context: 'Splitting scene markers so each actor appears in at most one cut',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int[]',
        description: 'Given a string `s`, partition `s` into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.',
        constraints: ['1 <= s.length <= 500'],
        hint: 'Precompute the last occurrence index of each character, then greedily extend end = max(end, last[s[i]]).',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return []',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(s):\n    last = {ch: i for i, ch in enumerate(s)}\n    res = []\n    start = end = 0\n    for i, ch in enumerate(s):\n        end = max(end, last[ch])\n        if i == end:\n            res.append(end - start + 1)\n            start = i + 1\n    return res',
            javascript: 'function solve(s) {\n    const last = new Map();\n    for (let i = 0; i < s.length; i++) last.set(s[i], i);\n    const res = [];\n    let start = 0, end = 0;\n    for (let i = 0; i < s.length; i++) {\n        end = Math.max(end, last.get(s[i]));\n        if (i === end) { res.push(end - start + 1); start = i + 1; }\n    }\n    return res;\n}'
        },
        testCases: [
            { args: ['ababcbacadefegdehijhklij'], expected: [9, 7, 8], isHidden: false },
            { args: ['eccbbbbdec'], expected: [10], isHidden: false },
            { args: ['abc'], expected: [1, 1, 1], isHidden: true }
        ]
    },
    {
        id: 'nflx-8',
        company: 'netflix',
        category: 'product',
        number: 8,
        title: 'Minimum Window Substring Cover',
        difficulty: 'Hard',
        topic: 'Sliding Window',
        frequency: '92% in Netflix Backend Onsite',
        context: 'Finding shortest subtitle span containing all required keywords',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }, { name: 't', type: 'string' }],
        returnType: 'string',
        description: 'Given two strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. Return `""` if no such substring exists.',
        constraints: ['1 <= s.length, t.length <= 10^5'],
        hint: 'Maintain target character counts and shrink the left pointer while all required characters are covered.',
        starter: {
            python: 'def solve(s, t):\n    # Write your logic here\n    return ""',
            javascript: 'function solve(s, t) {\n    // Write your logic here\n    return "";\n}'
        },
        solution: {
            python: 'def solve(s, t):\n    from collections import Counter\n    need = Counter(t)\n    missing = len(t)\n    l = best_l = 0\n    best_len = float("inf")\n    for r, ch in enumerate(s):\n        if need[ch] > 0: missing -= 1\n        need[ch] -= 1\n        while missing == 0:\n            if r - l + 1 < best_len:\n                best_len = r - l + 1\n                best_l = l\n            need[s[l]] += 1\n            if need[s[l]] > 0: missing += 1\n            l += 1\n    return "" if best_len == float("inf") else s[best_l:best_l + best_len]',
            javascript: 'function solve(s, t) {\n    const need = new Map();\n    for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);\n    let missing = t.length, l = 0, bestL = 0, bestLen = Infinity;\n    for (let r = 0; r < s.length; r++) {\n        const ch = s[r];\n        if ((need.get(ch) || 0) > 0) missing--;\n        need.set(ch, (need.get(ch) || 0) - 1);\n        while (missing === 0) {\n            if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }\n            const lch = s[l];\n            need.set(lch, (need.get(lch) || 0) + 1);\n            if (need.get(lch) > 0) missing++;\n            l++;\n        }\n    }\n    return bestLen === Infinity ? "" : s.slice(bestL, bestL + bestLen);\n}'
        },
        testCases: [
            { args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC', isHidden: false },
            { args: ['a', 'a'], expected: 'a', isHidden: false },
            { args: ['a', 'aa'], expected: '', isHidden: true }
        ]
    },
    {
        id: 'nflx-9',
        company: 'netflix',
        category: 'product',
        number: 9,
        title: 'Time Based Key-Value Version Lookup',
        difficulty: 'Medium',
        topic: 'Binary Search & Design',
        frequency: '90% in Netflix Microservices',
        context: 'Fetching latest A/B feature flag value at or before a timestamp',
        fnName: 'solve',
        params: [{ name: 'entries', type: 'string[]' }, { name: 'queries', type: 'string[]' }],
        returnType: 'string[]',
        description: 'Given `entries` formatted as `"key:val:timestamp"` (in non-decreasing timestamp order) and `queries` formatted as `"key:timestamp"`, for each query return the value with the largest `timestamp_prev <= timestamp`, or `""` if none exists.',
        constraints: ['1 <= entries.length, queries.length <= 10^4'],
        hint: 'Store (timestamp, value) lists per key and use binary search (upper_bound - 1) on timestamps.',
        starter: {
            python: 'def solve(entries, queries):\n    # Write your logic here\n    return []',
            javascript: 'function solve(entries, queries) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(entries, queries):\n    import bisect\n    store = {}\n    for e in entries:\n        k, v, ts = e.split(":")\n        store.setdefault(k, ([], []))\n        store[k][0].append(int(ts))\n        store[k][1].append(v)\n    res = []\n    for q in queries:\n        k, ts = q.split(":")\n        ts = int(ts)\n        if k not in store:\n            res.append("")\n        else:\n            times, vals = store[k]\n            idx = bisect.bisect_right(times, ts) - 1\n            res.append(vals[idx] if idx >= 0 else "")\n    return res',
            javascript: 'function solve(entries, queries) {\n    const store = new Map();\n    for (const e of entries) {\n        const [k, v, ts] = e.split(":");\n        if (!store.has(k)) store.set(k, []);\n        store.get(k).push([Number(ts), v]);\n    }\n    return queries.map(q => {\n        const [k, tsStr] = q.split(":");\n        const ts = Number(tsStr);\n        const arr = store.get(k);\n        if (!arr) return "";\n        let lo = 0, hi = arr.length - 1, ans = "";\n        while (lo <= hi) {\n            const mid = (lo + hi) >> 1;\n            if (arr[mid][0] <= ts) { ans = arr[mid][1]; lo = mid + 1; }\n            else hi = mid - 1;\n        }\n        return ans;\n    });\n}'
        },
        testCases: [
            { args: [['foo:bar:1', 'foo:bar2:4'], ['foo:1', 'foo:3', 'foo:4', 'foo:5']], expected: ['bar', 'bar', 'bar2', 'bar2'], isHidden: false },
            { args: [['love:high:10', 'love:low:20'], ['love:5', 'love:15']], expected: ['', 'high'], isHidden: false },
            { args: [['a:x:2'], ['b:2', 'a:1']], expected: ['', ''], isHidden: true }
        ]
    },
    {
        id: 'nflx-10',
        company: 'netflix',
        category: 'product',
        number: 10,
        title: 'Design Hit Counter in Last 5 Minutes',
        difficulty: 'Medium',
        topic: 'Queue & Sliding Window',
        frequency: '89% in Netflix Telemetry',
        context: 'Counting stream playback heartbeats within a 300-second window',
        fnName: 'solve',
        params: [{ name: 'hits', type: 'int[]' }, { name: 'queries', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given sorted timestamps `hits` when stream pings arrived, and sorted `queries` timestamps, return for each query `t` the number of hits in `[t - 299, t]`.',
        constraints: ['1 <= hits.length, queries.length <= 10^4'],
        hint: 'Use two pointers or a queue to maintain the active window [t - 299, t].',
        starter: {
            python: 'def solve(hits, queries):\n    # Write your logic here\n    return []',
            javascript: 'function solve(hits, queries) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(hits, queries):\n    import bisect\n    res = []\n    for t in queries:\n        l = bisect.bisect_left(hits, t - 299)\n        r = bisect.bisect_right(hits, t)\n        res.append(r - l)\n    return res',
            javascript: 'function solve(hits, queries) {\n    const lb = (target) => {\n        let l = 0, r = hits.length;\n        while (l < r) { const m = (l + r) >> 1; if (hits[m] < target) l = m + 1; else r = m; }\n        return l;\n    };\n    const ub = (target) => {\n        let l = 0, r = hits.length;\n        while (l < r) { const m = (l + r) >> 1; if (hits[m] <= target) l = m + 1; else r = m; }\n        return l;\n    };\n    return queries.map(t => ub(t) - lb(t - 299));\n}'
        },
        testCases: [
            { args: [[1, 2, 3], [4, 300, 301]], expected: [3, 3, 2], isHidden: false },
            { args: [[10, 20, 310], [309, 310]], expected: [2, 2], isHidden: false },
            { args: [[1], [500]], expected: [0], isHidden: true }
        ]
    },
    {
        id: 'nflx-11',
        company: 'netflix',
        category: 'product',
        number: 11,
        title: 'Longest Substring with At Most Two Distinct Characters',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        frequency: '87% in Netflix Search Indexing',
        context: 'Finding longest bilingual subtitle segment with <= 2 languages',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int',
        description: 'Given a string `s`, return the length of the longest substring that contains at most two distinct characters.',
        constraints: ['1 <= s.length <= 10^5'],
        hint: 'Sliding window tracking character counts; shrink left pointer when distinct map size > 2.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s):\n    cnt = {}\n    l = best = 0\n    for r, ch in enumerate(s):\n        cnt[ch] = cnt.get(ch, 0) + 1\n        while len(cnt) > 2:\n            cnt[s[l]] -= 1\n            if cnt[s[l]] == 0: del cnt[s[l]]\n            l += 1\n        best = max(best, r - l + 1)\n    return best',
            javascript: 'function solve(s) {\n    const cnt = new Map();\n    let l = 0, best = 0;\n    for (let r = 0; r < s.length; r++) {\n        cnt.set(s[r], (cnt.get(s[r]) || 0) + 1);\n        while (cnt.size > 2) {\n            const lc = s[l++];\n            cnt.set(lc, cnt.get(lc) - 1);\n            if (cnt.get(lc) === 0) cnt.delete(lc);\n        }\n        best = Math.max(best, r - l + 1);\n    }\n    return best;\n}'
        },
        testCases: [
            { args: ['eceba'], expected: 3, isHidden: false },
            { args: ['ccaabbb'], expected: 5, isHidden: false },
            { args: ['a'], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'nflx-12',
        company: 'netflix',
        category: 'product',
        number: 12,
        title: 'Minimum Number of Arrows to Burst Balloons',
        difficulty: 'Medium',
        topic: 'Greedy & Intervals',
        frequency: '86% in Netflix Ad-Tech Scheduling',
        context: 'Placing minimum ad-break markers covering overlapping watch windows',
        fnName: 'solve',
        params: [{ name: 'points', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given intervals `points[i] = [x_start, x_end]`, an arrow shot at `x` bursts all intervals where `x_start <= x <= x_end`. Return the minimum number of arrows needed to burst all intervals.',
        constraints: ['1 <= points.length <= 10^5'],
        hint: 'Sort intervals by end coordinate and greedily shoot at the earliest end not yet covered.',
        starter: {
            python: 'def solve(points):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(points) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(points):\n    pts = sorted(points, key=lambda x: x[1])\n    arrows = 1\n    end = pts[0][1]\n    for s, e in pts[1:]:\n        if s > end:\n            arrows += 1\n            end = e\n    return arrows',
            javascript: 'function solve(points) {\n    const pts = [...points].sort((a, b) => a[1] - b[1]);\n    let arrows = 1, end = pts[0][1];\n    for (let i = 1; i < pts.length; i++) {\n        if (pts[i][0] > end) { arrows++; end = pts[i][1]; }\n    }\n    return arrows;\n}'
        },
        testCases: [
            { args: [[[10, 16], [2, 8], [1, 6], [7, 12]]], expected: 2, isHidden: false },
            { args: [[[1, 2], [3, 4], [5, 6], [7, 8]]], expected: 4, isHidden: false },
            { args: [[[1, 2], [2, 3], [3, 4], [4, 5]]], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'nflx-13',
        company: 'netflix',
        category: 'product',
        number: 13,
        title: 'Kth Largest Element in Stream Updates',
        difficulty: 'Easy',
        topic: 'Heap',
        frequency: '88% in Netflix Trending Ranker',
        context: 'Maintaining live top-K viewership cutoff as new scores stream in',
        fnName: 'solve',
        params: [{ name: 'k', type: 'int' }, { name: 'nums', type: 'int[]' }, { name: 'adds', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given an integer `k`, initial scores `nums`, and a sequence of incoming scores `adds`, return the `k`-th largest score after each element in `adds` is added.',
        constraints: ['1 <= k <= 10^4', 'k - 1 <= nums.length'],
        hint: 'Maintain a min-heap of size k; the root is always the k-th largest element.',
        starter: {
            python: 'def solve(k, nums, adds):\n    # Write your logic here\n    return []',
            javascript: 'function solve(k, nums, adds) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(k, nums, adds):\n    import heapq\n    h = list(nums)\n    heapq.heapify(h)\n    while len(h) > k: heapq.heappop(h)\n    res = []\n    for x in adds:\n        heapq.heappush(h, x)\n        if len(h) > k: heapq.heappop(h)\n        res.append(h[0])\n    return res',
            javascript: 'function solve(k, nums, adds) {\n    const arr = [...nums].sort((a, b) => b - a).slice(0, k);\n    return adds.map(x => {\n        arr.push(x);\n        arr.sort((a, b) => b - a);\n        if (arr.length > k) arr.pop();\n        return arr[k - 1];\n    });\n}'
        },
        testCases: [
            { args: [3, [4, 5, 8, 2], [3, 5, 10, 9, 4]], expected: [4, 5, 5, 8, 8], isHidden: false },
            { args: [1, [], [-3, -2, -4, 0, 4]], expected: [-3, -2, -2, 0, 4], isHidden: false },
            { args: [2, [5], [1, 8, 3]], expected: [1, 5, 5], isHidden: true }
        ]
    },
    {
        id: 'nflx-14',
        company: 'netflix',
        category: 'product',
        number: 14,
        title: 'Find Peak Bitrate Frame in Video',
        difficulty: 'Medium',
        topic: 'Binary Search',
        frequency: '85% in Netflix Encoding Lab',
        context: 'Locating local maximum bitrate spike in stream telemetry',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given a 0-indexed integer array `nums` where adjacent elements are distinct, find any peak element (strictly greater than its neighbors) and return its value.',
        constraints: ['1 <= nums.length <= 1000'],
        hint: 'Binary search: if nums[mid] < nums[mid + 1], move right; otherwise move left.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    l, r = 0, len(nums) - 1\n    while l < r:\n        m = (l + r) // 2\n        if nums[m] < nums[m + 1]: l = m + 1\n        else: r = m\n    return nums[l]',
            javascript: 'function solve(nums) {\n    let l = 0, r = nums.length - 1;\n    while (l < r) {\n        const m = (l + r) >> 1;\n        if (nums[m] < nums[m + 1]) l = m + 1;\n        else r = m;\n    }\n    return nums[l];\n}'
        },
        testCases: [
            { args: [[1, 2, 3, 1]], expected: 3, isHidden: false },
            { args: [[1, 2, 1, 3, 5, 6, 4]], expected: 6, isHidden: false },
            { args: [[10]], expected: 10, isHidden: true }
        ]
    },
    {
        id: 'nflx-15',
        company: 'netflix',
        category: 'product',
        number: 15,
        title: 'Minimum Time to Complete All Encoding Trips',
        difficulty: 'Medium',
        topic: 'Binary Search on Answer',
        frequency: '90% in Netflix Cloud Transcoding',
        context: 'Scheduling video chunks across heterogeneous GPU workers',
        fnName: 'solve',
        params: [{ name: 'time', type: 'int[]' }, { name: 'totalTrips', type: 'int' }],
        returnType: 'int',
        description: 'Each worker `i` takes `time[i]` minutes to encode 1 chunk. All workers run in parallel. Return the minimum time required for all workers to complete at least `totalTrips` chunks.',
        constraints: ['1 <= time.length <= 10^5', '1 <= totalTrips <= 10^7'],
        hint: 'Binary search t in [1, min(time) * totalTrips] checking sum(t // ti) >= totalTrips.',
        starter: {
            python: 'def solve(time, totalTrips):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(time, totalTrips) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(time, totalTrips):\n    lo, hi = 1, min(time) * totalTrips\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if sum(mid // t for t in time) >= totalTrips: hi = mid\n        else: lo = mid + 1\n    return lo',
            javascript: 'function solve(time, totalTrips) {\n    let lo = 1, hi = Math.min(...time) * totalTrips;\n    while (lo < hi) {\n        const mid = Math.floor((lo + hi) / 2);\n        let trips = 0;\n        for (const t of time) trips += Math.floor(mid / t);\n        if (trips >= totalTrips) hi = mid;\n        else lo = mid + 1;\n    }\n    return lo;\n}'
        },
        testCases: [
            { args: [[1, 2, 3], 5], expected: 3, isHidden: false },
            { args: [[2], 1], expected: 2, isHidden: false },
            { args: [[5, 10, 10], 9], expected: 25, isHidden: true }
        ]
    },
    {
        id: 'nflx-16',
        company: 'netflix',
        category: 'product',
        number: 16,
        title: 'Longest Turbulent Subarray',
        difficulty: 'Medium',
        topic: 'Sliding Window & DP',
        frequency: '84% in Netflix QoE Analytics',
        context: 'Detecting longest alternating bitrate oscillation window',
        fnName: 'solve',
        params: [{ name: 'arr', type: 'int[]' }],
        returnType: 'int',
        description: 'A subarray is turbulent if the comparison sign flips between every adjacent pair of elements (`>` then `<` then `>`, or `<` then `>` then `<`). Return the length of the maximum size turbulent subarray of `arr`.',
        constraints: ['1 <= arr.length <= 4 * 10^4'],
        hint: 'Track inc (ending with arr[i-1] < arr[i]) and dec (ending with arr[i-1] > arr[i]) lengths.',
        starter: {
            python: 'def solve(arr):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(arr) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(arr):\n    inc = dec = best = 1\n    for i in range(1, len(arr)):\n        if arr[i] > arr[i - 1]:\n            inc, dec = dec + 1, 1\n        elif arr[i] < arr[i - 1]:\n            dec, inc = inc + 1, 1\n        else:\n            inc = dec = 1\n        best = max(best, inc, dec)\n    return best',
            javascript: 'function solve(arr) {\n    let inc = 1, dec = 1, best = 1;\n    for (let i = 1; i < arr.length; i++) {\n        if (arr[i] > arr[i - 1]) { inc = dec + 1; dec = 1; }\n        else if (arr[i] < arr[i - 1]) { dec = inc + 1; inc = 1; }\n        else { inc = 1; dec = 1; }\n        best = Math.max(best, inc, dec);\n    }\n    return best;\n}'
        },
        testCases: [
            { args: [[9, 4, 2, 10, 7, 8, 8, 1, 9]], expected: 5, isHidden: false },
            { args: [[4, 8, 12, 16]], expected: 2, isHidden: false },
            { args: [[100]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'nflx-17',
        company: 'netflix',
        category: 'product',
        number: 17,
        title: 'Minimum Domino Rotations For Equal Row',
        difficulty: 'Medium',
        topic: 'Greedy',
        frequency: '85% in Netflix Core Infrastructure',
        context: 'Minimizing CDN mirror swaps to unify stream quality',
        fnName: 'solve',
        params: [{ name: 'tops', type: 'int[]' }, { name: 'bottoms', type: 'int[]' }],
        returnType: 'int',
        description: 'Given two integer arrays `tops` and `bottoms` of length `n`, you may swap `tops[i]` with `bottoms[i]`. Return the minimum number of swaps so that all values in `tops` are the same or all values in `bottoms` are the same, or `-1` if impossible.',
        constraints: ['2 <= tops.length <= 2 * 10^4'],
        hint: 'The target value must be either tops[0] or bottoms[0]. Check both candidates.',
        starter: {
            python: 'def solve(tops, bottoms):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(tops, bottoms) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(tops, bottoms):\n    def check(x):\n        rot_top = rot_bot = 0\n        for t, b in zip(tops, bottoms):\n            if t != x and b != x: return float("inf")\n            if t != x: rot_top += 1\n            elif b != x: rot_bot += 1\n        return min(rot_top, rot_bot)\n    ans = min(check(tops[0]), check(bottoms[0]))\n    return -1 if ans == float("inf") else ans',
            javascript: 'function solve(tops, bottoms) {\n    const check = (x) => {\n        let rt = 0, rb = 0;\n        for (let i = 0; i < tops.length; i++) {\n            if (tops[i] !== x && bottoms[i] !== x) return Infinity;\n            if (tops[i] !== x) rt++;\n            else if (bottoms[i] !== x) rb++;\n        }\n        return Math.min(rt, rb);\n    };\n    const ans = Math.min(check(tops[0]), check(bottoms[0]));\n    return ans === Infinity ? -1 : ans;\n}'
        },
        testCases: [
            { args: [[2, 1, 2, 4, 2, 2], [5, 2, 6, 2, 3, 2]], expected: 2, isHidden: false },
            { args: [[3, 5, 1, 2, 3], [3, 6, 3, 3, 4]], expected: -1, isHidden: false },
            { args: [[1, 1, 1], [2, 2, 2]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'nflx-18',
        company: 'netflix',
        category: 'product',
        number: 18,
        title: 'Car Fleet Grouping on Highway',
        difficulty: 'Medium',
        topic: 'Sorting & Monotonic Stack',
        frequency: '86% in Netflix Traffic Shaping',
        context: 'Counting merged stream packet convoys arriving at destination',
        fnName: 'solve',
        params: [{ name: 'target', type: 'int' }, { name: 'position', type: 'int[]' }, { name: 'speed', type: 'int[]' }],
        returnType: 'int',
        description: 'Cars start at `position[i]` with `speed[i]` heading toward `target`. A faster car catches up to a slower car ahead and forms a fleet at the slower speed. Return the number of fleets that arrive at `target`.',
        constraints: ['1 <= position.length <= 10^5'],
        hint: 'Sort cars by position descending and track arrival times; a new fleet forms whenever arrivalTime > prevFleetTime.',
        starter: {
            python: 'def solve(target, position, speed):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(target, position, speed) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(target, position, speed):\n    cars = sorted(zip(position, speed), reverse=True)\n    fleets = 0\n    prev_time = -1.0\n    for pos, spd in cars:\n        t = (target - pos) / spd\n        if t > prev_time:\n            fleets += 1\n            prev_time = t\n    return fleets',
            javascript: 'function solve(target, position, speed) {\n    const cars = position.map((p, i) => [p, speed[i]]).sort((a, b) => b[0] - a[0]);\n    let fleets = 0, prevTime = -1;\n    for (const [p, s] of cars) {\n        const t = (target - p) / s;\n        if (t > prevTime) { fleets++; prevTime = t; }\n    }\n    return fleets;\n}'
        },
        testCases: [
            { args: [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]], expected: 3, isHidden: false },
            { args: [10, [3], [3]], expected: 1, isHidden: false },
            { args: [100, [0, 2, 4], [4, 2, 1]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'nflx-19',
        company: 'netflix',
        category: 'product',
        number: 19,
        title: 'Koko-Style Banana / Chunk Bandwidth Cap',
        difficulty: 'Medium',
        topic: 'Binary Search',
        frequency: '87% in Netflix CDN Edge',
        context: 'Minimizing max per-second chunk rate while keeping buffer full',
        fnName: 'solve',
        params: [{ name: 'quantities', type: 'int[]' }, { name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given `n` edge servers and `quantities` where `quantities[i]` is the count of media assets of type `i`. Each server holds at most one asset type, and at most `x` assets. Return the minimum possible maximum assets `x` assigned to any server.',
        constraints: ['1 <= quantities.length <= n <= 10^5'],
        hint: 'Binary search x in [1, max(quantities)] checking sum(ceil(q / x)) <= n.',
        starter: {
            python: 'def solve(quantities, n):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(quantities, n) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(quantities, n):\n    lo, hi = 1, max(quantities)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if sum((q + mid - 1) // mid for q in quantities) <= n: hi = mid\n        else: lo = mid + 1\n    return lo',
            javascript: 'function solve(quantities, n) {\n    let lo = 1, hi = Math.max(...quantities);\n    while (lo < hi) {\n        const mid = (lo + hi) >> 1;\n        let needed = 0;\n        for (const q of quantities) needed += Math.ceil(q / mid);\n        if (needed <= n) hi = mid;\n        else lo = mid + 1;\n    }\n    return lo;\n}'
        },
        testCases: [
            { args: [[11, 6], 6], expected: 3, isHidden: false },
            { args: [[15, 10, 10], 7], expected: 5, isHidden: false },
            { args: [[100000], 1], expected: 100000, isHidden: true }
        ]
    },
    {
        id: 'nflx-20',
        company: 'netflix',
        category: 'product',
        number: 20,
        title: 'Find Original Array From Doubled Array',
        difficulty: 'Medium',
        topic: 'Sorting & Hash Map',
        frequency: '86% in Netflix Data Engineering',
        context: 'Recovering original metric series from 2x-upsampled telemetry',
        fnName: 'solve',
        params: [{ name: 'changed', type: 'int[]' }],
        returnType: 'int[]',
        description: 'An integer array `original` was transformed into `changed` by appending twice the value of every element and shuffling. Given `changed`, return `original` sorted ascending, or `[]` if `changed` is not a valid doubled array.',
        constraints: ['1 <= changed.length <= 10^5'],
        hint: 'Sort ascending and pair each smallest remaining element x with 2 * x using a frequency map.',
        starter: {
            python: 'def solve(changed):\n    # Write your logic here\n    return []',
            javascript: 'function solve(changed) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(changed):\n    if len(changed) % 2: return []\n    from collections import Counter\n    cnt = Counter(changed)\n    res = []\n    for x in sorted(changed):\n        if cnt[x] == 0: continue\n        if cnt[2 * x] == 0: return []\n        cnt[x] -= 1\n        if cnt[2 * x] < 0: return []\n        cnt[2 * x] -= 1\n        if cnt[x] < 0: return []\n        res.append(x)\n    return res',
            javascript: 'function solve(changed) {\n    if (changed.length % 2) return [];\n    const cnt = new Map();\n    for (const x of changed) cnt.set(x, (cnt.get(x) || 0) + 1);\n    const sorted = [...changed].sort((a, b) => a - b);\n    const res = [];\n    for (const x of sorted) {\n        if (!cnt.get(x)) continue;\n        cnt.set(x, cnt.get(x) - 1);\n        if (!cnt.get(2 * x)) return [];\n        cnt.set(2 * x, cnt.get(2 * x) - 1);\n        res.push(x);\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [[1, 3, 4, 2, 6, 8]], expected: [1, 3, 4], isHidden: false },
            { args: [[6, 3, 0, 1]], expected: [], isHidden: false },
            { args: [[0, 0]], expected: [0], isHidden: true }
        ]
    }
];

