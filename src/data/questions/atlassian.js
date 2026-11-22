export const ATLASSIAN_QUESTIONS = [
    {
        id: 'atln-1',
        company: 'atlassian',
        category: 'product',
        number: 1,
        title: 'Rank Teams by Votes',
        difficulty: 'Medium',
        topic: 'Sorting & Counting',
        frequency: '99% in Atlassian P3/P4 Coding Round',
        context: 'Ranking Jira sprint priority options from ranked-choice team ballots',
        fnName: 'solve',
        params: [{ name: 'votes', type: 'string[]' }],
        returnType: 'string',
        description: 'Each string in `votes` represents one voter ranking all teams from highest to lowest. Rank teams by most 1st-place votes, breaking ties by 2nd-place votes, and so on, and finally alphabetically ascending.',
        constraints: ['1 <= votes.length <= 1000', '1 <= votes[i].length <= 26'],
        hint: 'Build a count array of length numTeams for each team and sort using (-count[0], -count[1], ..., teamChar).',
        starter: {
            python: 'def solve(votes):\n    # Write your logic here\n    return ""',
            javascript: 'function solve(votes) {\n    // Write your logic here\n    return "";\n}'
        },
        solution: {
            python: 'def solve(votes):\n    m = len(votes[0])\n    ranks = {ch: [0] * m for ch in votes[0]}\n    for v in votes:\n        for i, ch in enumerate(v): ranks[ch][i] += 1\n    return "".join(sorted(votes[0], key=lambda ch: ([-c for c in ranks[ch]], ch)))',
            javascript: 'function solve(votes) {\n    const m = votes[0].length;\n    const ranks = new Map();\n    for (const ch of votes[0]) ranks.set(ch, new Array(m).fill(0));\n    for (const v of votes) for (let i = 0; i < m; i++) ranks.get(v[i])[i]++;\n    return [...votes[0]].sort((a, b) => {\n        const ra = ranks.get(a), rb = ranks.get(b);\n        for (let i = 0; i < m; i++) if (ra[i] !== rb[i]) return rb[i] - ra[i];\n        return a < b ? -1 : 1;\n    }).join("");\n}'
        },
        testCases: [
            { args: [['ABC', 'ACB', 'ABC', 'ACB', 'ACB']], expected: 'ACB', isHidden: false },
            { args: [['WXYZ', 'XYZW']], expected: 'XWYZ', isHidden: false },
            { args: [['ZMNAGUEDSJYLBOPHRQICWFXTVK']], expected: 'ZMNAGUEDSJYLBOPHRQICWFXTVK', isHidden: true }
        ]
    },
    {
        id: 'atln-2',
        company: 'atlassian',
        category: 'product',
        number: 2,
        title: 'File Collection Top K Storage Consumers',
        difficulty: 'Medium',
        topic: 'Hash Map & Sorting',
        frequency: '97% in Atlassian Machine Coding',
        context: 'Computing total storage and top K collections in Confluence attachments',
        fnName: 'solve',
        params: [{ name: 'files', type: 'string[]' }, { name: 'k', type: 'int' }],
        returnType: 'string[]',
        description: 'Given `files` formatted as `"size:collection"` (where collection may be `""`), return the top `k` collection names ordered by total file size descending (break ties alphabetically ascending). Ignore entries with empty collection.',
        constraints: ['1 <= files.length <= 10^4'],
        hint: 'Aggregate sizes per collection in a map, then sort by (-size, name) and slice top k.',
        starter: {
            python: 'def solve(files, k):\n    # Write your logic here\n    return []',
            javascript: 'function solve(files, k) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(files, k):\n    totals = {}\n    for f in files:\n        sz, col = f.split(":")\n        if col: totals[col] = totals.get(col, 0) + int(sz)\n    return [c for c, _ in sorted(totals.items(), key=lambda x: (-x[1], x[0]))[:k]]',
            javascript: 'function solve(files, k) {\n    const totals = new Map();\n    for (const f of files) {\n        const [sz, col] = f.split(":");\n        if (col) totals.set(col, (totals.get(col) || 0) + Number(sz));\n    }\n    return [...totals.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, k).map(x => x[0]);\n}'
        },
        testCases: [
            { args: [['100:', '200:c1', '200:c1', '300:c2', '100:c3'], 2], expected: ['c1', 'c2'], isHidden: false },
            { args: [['50:b', '50:a', '10:c'], 2], expected: ['a', 'b'], isHidden: false },
            { args: [['100:'], 1], expected: [], isHidden: true }
        ]
    },
    {
        id: 'atln-3',
        company: 'atlassian',
        category: 'product',
        number: 3,
        title: 'Logger Rate Limiter Message Filter',
        difficulty: 'Easy',
        topic: 'Hash Map',
        frequency: '95% in Atlassian Screening',
        context: 'Deduplicating identical Jira webhook alerts within a 10-second cooldown',
        fnName: 'solve',
        params: [{ name: 'timestamps', type: 'int[]' }, { name: 'messages', type: 'string[]' }],
        returnType: 'boolean[]',
        description: 'Given chronological `timestamps` and `messages`, each unique message should only be printed if it has not been printed in the last 10 seconds (`timestamp >= lastPrinted + 10`). Return a boolean array indicating whether each message is printed.',
        constraints: ['1 <= timestamps.length <= 10^4'],
        hint: 'Store lastAllowedTimestamp per message; only update it when the message is actually printed.',
        starter: {
            python: 'def solve(timestamps, messages):\n    # Write your logic here\n    return []',
            javascript: 'function solve(timestamps, messages) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(timestamps, messages):\n    last = {}\n    res = []\n    for t, m in zip(timestamps, messages):\n        if m not in last or t >= last[m] + 10:\n            last[m] = t\n            res.append(True)\n        else:\n            res.append(False)\n    return res',
            javascript: 'function solve(timestamps, messages) {\n    const last = new Map();\n    return timestamps.map((t, i) => {\n        const m = messages[i];\n        if (!last.has(m) || t >= last.get(m) + 10) { last.set(m, t); return true; }\n        return false;\n    });\n}'
        },
        testCases: [
            { args: [[1, 2, 3, 8, 10, 11], ['foo', 'bar', 'foo', 'bar', 'foo', 'foo']], expected: [true, true, false, false, false, true], isHidden: false },
            { args: [[0, 10], ['err', 'err']], expected: [true, true], isHidden: false },
            { args: [[5, 9], ['a', 'a']], expected: [true, false], isHidden: true }
        ]
    },
    {
        id: 'atln-4',
        company: 'atlassian',
        category: 'product',
        number: 4,
        title: 'Time Needed to Inform All Employees',
        difficulty: 'Medium',
        topic: 'Tree DFS',
        frequency: '92% in Atlassian Org Hierarchy Round',
        context: 'Calculating worst-case broadcast latency down Slack/Teams org tree',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }, { name: 'headID', type: 'int' }, { name: 'manager', type: 'int[]' }, { name: 'informTime', type: 'int[]' }],
        returnType: 'int',
        description: 'A company has `n` employees (`0..n-1`) with root `headID`. Each employee `i` reports to `manager[i]` (`-1` for head) and takes `informTime[i]` minutes to inform all their direct subordinates. Return total minutes to inform everyone.',
        constraints: ['1 <= n <= 10^5'],
        hint: 'Build an adjacency list from manager -> subordinates and return max path sum from headID via DFS.',
        starter: {
            python: 'def solve(n, headID, manager, informTime):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(n, headID, manager, informTime) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(n, headID, manager, informTime):\n    import sys\n    sys.setrecursionlimit(200000)\n    children = [[] for _ in range(n)]\n    for i, m in enumerate(manager):\n        if m != -1: children[m].append(i)\n    def dfs(u):\n        if not children[u]: return 0\n        return informTime[u] + max(dfs(v) for v in children[u])\n    return dfs(headID)',
            javascript: 'function solve(n, headID, manager, informTime) {\n    const children = Array.from({ length: n }, () => []);\n    for (let i = 0; i < n; i++) if (manager[i] !== -1) children[manager[i]].push(i);\n    const dfs = (u) => {\n        if (!children[u].length) return 0;\n        let mx = 0;\n        for (const v of children[u]) mx = Math.max(mx, dfs(v));\n        return informTime[u] + mx;\n    };\n    return dfs(headID);\n}'
        },
        testCases: [
            { args: [1, 0, [-1], [0]], expected: 0, isHidden: false },
            { args: [6, 2, [2, 2, -1, 2, 2, 2], [0, 0, 1, 0, 0, 0]], expected: 1, isHidden: false },
            { args: [7, 6, [1, 2, 3, 4, 5, 6, -1], [0, 6, 5, 4, 3, 2, 1]], expected: 21, isHidden: true }
        ]
    },
    {
        id: 'atln-5',
        company: 'atlassian',
        category: 'product',
        number: 5,
        title: 'Cinema Seat Allocation Max Families',
        difficulty: 'Medium',
        topic: 'Bitmask & Hash Map',
        frequency: '88% in Atlassian OA',
        context: 'Maximizing 4-person contiguous conference pod bookings across N rows',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }, { name: 'reservedSeats', type: 'int[][]' }],
        returnType: 'int',
        description: 'A cinema has `n` rows of seats `1..10`. A 4-person family can sit at `[2..5]`, `[4..7]`, or `[6..9]`. Given `reservedSeats[i] = [row, seat]`, return the maximum number of 4-person families that can be seated.',
        constraints: ['1 <= n <= 10^9', '1 <= reservedSeats.length <= 10^4'],
        hint: 'Rows with zero reserved seats can fit 2 families. For rows with reservations, track blocked regions via a 3-bit mask.',
        starter: {
            python: 'def solve(n, reservedSeats):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(n, reservedSeats) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(n, reservedSeats):\n    rows = {}\n    for r, c in reservedSeats:\n        mask = rows.get(r, 0)\n        if 2 <= c <= 5: mask |= 1\n        if 4 <= c <= 7: mask |= 2\n        if 6 <= c <= 9: mask |= 4\n        rows[r] = mask\n    ans = (n - len(rows)) * 2\n    for mask in rows.values():\n        if mask == 0: ans += 2\n        elif mask != 7: ans += 1\n    return ans',
            javascript: 'function solve(n, reservedSeats) {\n    const rows = new Map();\n    for (const [r, c] of reservedSeats) {\n        let mask = rows.get(r) || 0;\n        if (c >= 2 && c <= 5) mask |= 1;\n        if (c >= 4 && c <= 7) mask |= 2;\n        if (c >= 6 && c <= 9) mask |= 4;\n        rows.set(r, mask);\n    }\n    let ans = (n - rows.size) * 2;\n    for (const mask of rows.values()) {\n        if (mask === 0) ans += 2;\n        else if (mask !== 7) ans += 1;\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [3, [[1, 2], [1, 3], [1, 8], [2, 6], [3, 1], [3, 10]]], expected: 4, isHidden: false },
            { args: [2, [[2, 1], [1, 8], [2, 6]]], expected: 2, isHidden: false },
            { args: [4, [[4, 3], [1, 4], [4, 6], [1, 7]]], expected: 4, isHidden: true }
        ]
    },
    {
        id: 'atln-6',
        company: 'atlassian',
        category: 'product',
        number: 6,
        title: 'Valid Parenthesis String with Wildcard Stars',
        difficulty: 'Medium',
        topic: 'Greedy',
        frequency: '87% in Atlassian Coding Interview',
        context: 'Validating Jira JQL expression brackets with optional wildcard tokens',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'boolean',
        description: 'Given a string `s` containing `(`, `)`, and `*` (where `*` can be `(`, `)`, or empty string), return `true` if `s` can be valid.',
        constraints: ['1 <= s.length <= 100'],
        hint: 'Track [lo, hi] range of possible open "(" counts; clamp lo = max(lo, 0) and fail immediately if hi < 0.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return False',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(s):\n    lo = hi = 0\n    for ch in s:\n        lo += 1 if ch == "(" else -1\n        hi += 1 if ch != ")" else -1\n        if hi < 0: return False\n        lo = max(lo, 0)\n    return lo == 0',
            javascript: 'function solve(s) {\n    let lo = 0, hi = 0;\n    for (const ch of s) {\n        lo += ch === "(" ? 1 : -1;\n        hi += ch !== ")" ? 1 : -1;\n        if (hi < 0) return false;\n        if (lo < 0) lo = 0;\n    }\n    return lo === 0;\n}'
        },
        testCases: [
            { args: ['()'], expected: true, isHidden: false },
            { args: ['(*)'], expected: true, isHidden: false },
            { args: ['(*))'], expected: true, isHidden: true }
        ]
    },
    {
        id: 'atln-7',
        company: 'atlassian',
        category: 'product',
        number: 7,
        title: 'Lemonade Change Register Simulation',
        difficulty: 'Easy',
        topic: 'Greedy',
        frequency: '85% in Atlassian Screening',
        context: 'Verifying exact change availability in sequential \$5/\$10/\$20 payments',
        fnName: 'solve',
        params: [{ name: 'bills', type: 'int[]' }],
        returnType: 'boolean',
        description: 'Each item costs `5`. Customers pay sequentially with `5`, `10`, or `20`. Starting with no change, return `true` if you can give exact change to every customer.',
        constraints: ['1 <= bills.length <= 10^5'],
        hint: 'Track count of 5s and 10s; for 20, prefer giving 10 + 5 over three 5s.',
        starter: {
            python: 'def solve(bills):\n    # Write your logic here\n    return False',
            javascript: 'function solve(bills) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(bills):\n    fives = tens = 0\n    for b in bills:\n        if b == 5: fives += 1\n        elif b == 10:\n            if fives == 0: return False\n            fives -= 1; tens += 1\n        else:\n            if tens > 0 and fives > 0: tens -= 1; fives -= 1\n            elif fives >= 3: fives -= 3\n            else: return False\n    return True',
            javascript: 'function solve(bills) {\n    let fives = 0, tens = 0;\n    for (const b of bills) {\n        if (b === 5) fives++;\n        else if (b === 10) { if (!fives) return false; fives--; tens++; }\n        else {\n            if (tens > 0 && fives > 0) { tens--; fives--; }\n            else if (fives >= 3) fives -= 3;\n            else return false;\n        }\n    }\n    return true;\n}'
        },
        testCases: [
            { args: [[5, 5, 5, 10, 20]], expected: true, isHidden: false },
            { args: [[5, 5, 10, 10, 20]], expected: false, isHidden: false },
            { args: [[5, 10, 5, 20]], expected: true, isHidden: true }
        ]
    },
    {
        id: 'atln-8',
        company: 'atlassian',
        category: 'product',
        number: 8,
        title: 'Most Frequent Words Top K List',
        difficulty: 'Medium',
        topic: 'Hash Map & Sorting',
        frequency: '90% in Atlassian Confluence Search',
        context: 'Finding top K trending Jira issue tags sorted by frequency & tie-break',
        fnName: 'solve',
        params: [{ name: 'words', type: 'string[]' }, { name: 'k', type: 'int' }],
        returnType: 'string[]',
        description: 'Given an array of strings `words` and an integer `k`, return the `k` most frequent strings sorted by frequency descending, breaking ties lexicographically ascending.',
        constraints: ['1 <= words.length <= 500'],
        hint: 'Count frequencies, then sort unique words by (-freq, word) and take first k.',
        starter: {
            python: 'def solve(words, k):\n    # Write your logic here\n    return []',
            javascript: 'function solve(words, k) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(words, k):\n    from collections import Counter\n    cnt = Counter(words)\n    return sorted(cnt.keys(), key=lambda w: (-cnt[w], w))[:k]',
            javascript: 'function solve(words, k) {\n    const cnt = new Map();\n    for (const w of words) cnt.set(w, (cnt.get(w) || 0) + 1);\n    return [...cnt.keys()].sort((a, b) => cnt.get(b) - cnt.get(a) || (a < b ? -1 : 1)).slice(0, k);\n}'
        },
        testCases: [
            { args: [['i', 'love', 'code', 'i', 'love', 'coding'], 2], expected: ['i', 'love'], isHidden: false },
            { args: [['the', 'day', 'is', 'sunny', 'the', 'the', 'the', 'sunny', 'is', 'is'], 4], expected: ['the', 'is', 'sunny', 'day'], isHidden: false },
            { args: [['a', 'b', 'c'], 2], expected: ['a', 'b'], isHidden: true }
        ]
    },
    {
        id: 'atln-9',
        company: 'atlassian',
        category: 'product',
        number: 9,
        title: 'Find Winner on a Tic Tac Toe Game',
        difficulty: 'Easy',
        topic: 'Matrix Simulation',
        frequency: '86% in Atlassian P3 Design',
        context: 'Evaluating 3x3 board win conditions from alternating player move list',
        fnName: 'solve',
        params: [{ name: 'moves', type: 'int[][]' }],
        returnType: 'string',
        description: 'Player A (`"A"`) and Player B (`"B"`) take turns placing marks on a 3x3 grid (`moves[i] = [row, col]`). Return `"A"` or `"B"` if a player wins, `"Draw"` if all 9 squares are filled with no winner, or `"Pending"` otherwise.',
        constraints: ['1 <= moves.length <= 9'],
        hint: 'Track row sums, col sums, and 2 diagonal sums (+1 for A, -1 for B); any reaching +-3 wins.',
        starter: {
            python: 'def solve(moves):\n    # Write your logic here\n    return "Pending"',
            javascript: 'function solve(moves) {\n    // Write your logic here\n    return "Pending";\n}'
        },
        solution: {
            python: 'def solve(moves):\n    rows, cols = [0]*3, [0]*3\n    d1 = d2 = 0\n    for idx, (r, c) in enumerate(moves):\n        p = 1 if idx % 2 == 0 else -1\n        rows[r] += p; cols[c] += p\n        if r == c: d1 += p\n        if r + c == 2: d2 += p\n        if 3 in (abs(rows[r]), abs(cols[c]), abs(d1), abs(d2)):\n            return "A" if p == 1 else "B"\n    return "Draw" if len(moves) == 9 else "Pending"',
            javascript: 'function solve(moves) {\n    const rows = [0,0,0], cols = [0,0,0];\n    let d1 = 0, d2 = 0;\n    for (let i = 0; i < moves.length; i++) {\n        const [r, c] = moves[i], p = i % 2 === 0 ? 1 : -1;\n        rows[r] += p; cols[c] += p;\n        if (r === c) d1 += p; if (r + c === 2) d2 += p;\n        if (Math.abs(rows[r]) === 3 || Math.abs(cols[c]) === 3 || Math.abs(d1) === 3 || Math.abs(d2) === 3) return p === 1 ? "A" : "B";\n    }\n    return moves.length === 9 ? "Draw" : "Pending";\n}'
        },
        testCases: [
            { args: [[[0, 0], [2, 0], [1, 1], [2, 1], [2, 2]]], expected: 'A', isHidden: false },
            { args: [[[0, 0], [1, 1], [0, 1], [0, 2], [1, 0], [2, 0]]], expected: 'B', isHidden: false },
            { args: [[[0, 0], [1, 1], [2, 0], [1, 0], [1, 2], [2, 1], [0, 1], [0, 2], [2, 2]]], expected: 'Draw', isHidden: true }
        ]
    },
    {
        id: 'atln-10',
        company: 'atlassian',
        category: 'product',
        number: 10,
        title: 'Minimum Time Visiting All Points',
        difficulty: 'Easy',
        topic: 'Geometry',
        frequency: '84% in Atlassian Screening',
        context: 'Computing Chebyshev travel time across 2D canvas coordinates',
        fnName: 'solve',
        params: [{ name: 'points', type: 'int[][]' }],
        returnType: 'int',
        description: 'On a 2D plane, you can move 1 unit horizontally, vertically, or diagonally in 1 second. Return the minimum time in seconds to visit all `points` in order.',
        constraints: ['1 <= points.length <= 100'],
        hint: 'Chebyshev distance between (x1, y1) and (x2, y2) is max(|x2 - x1|, |y2 - y1|).',
        starter: {
            python: 'def solve(points):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(points) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(points):\n    return sum(max(abs(points[i][0] - points[i-1][0]), abs(points[i][1] - points[i-1][1])) for i in range(1, len(points)))',
            javascript: 'function solve(points) {\n    let t = 0;\n    for (let i = 1; i < points.length; i++) t += Math.max(Math.abs(points[i][0] - points[i - 1][0]), Math.abs(points[i][1] - points[i - 1][1]));\n    return t;\n}'
        },
        testCases: [
            { args: [[[1, 1], [3, 4], [-1, 0]]], expected: 7, isHidden: false },
            { args: [[[3, 2], [-2, 2]]], expected: 5, isHidden: false },
            { args: [[[0, 0]]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'atln-11',
        company: 'atlassian',
        category: 'product',
        number: 11,
        title: 'Minimum Number of Steps to Make Two Strings Anagram',
        difficulty: 'Medium',
        topic: 'Hash Map & Counting',
        frequency: '88% in Atlassian OA',
        context: 'Diffing two tag sets by minimum character replacements',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }, { name: 't', type: 'string' }],
        returnType: 'int',
        description: 'Given two equal-length strings `s` and `t`, in one step you can replace any character in `t` with another character. Return the minimum steps to make `t` an anagram of `s`.',
        constraints: ['1 <= s.length == t.length <= 5 * 10^4'],
        hint: 'Sum max(0, count_s[ch] - count_t[ch]) over all characters.',
        starter: {
            python: 'def solve(s, t):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s, t) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s, t):\n    from collections import Counter\n    cs, ct = Counter(s), Counter(t)\n    return sum(max(0, cs[ch] - ct[ch]) for ch in cs)',
            javascript: 'function solve(s, t) {\n    const cs = new Map(), ct = new Map();\n    for (const ch of s) cs.set(ch, (cs.get(ch) || 0) + 1);\n    for (const ch of t) ct.set(ch, (ct.get(ch) || 0) + 1);\n    let ans = 0;\n    for (const [ch, v] of cs.entries()) ans += Math.max(0, v - (ct.get(ch) || 0));\n    return ans;\n}'
        },
        testCases: [
            { args: ['bab', 'aba'], expected: 1, isHidden: false },
            { args: ['leetcode', 'practice'], expected: 5, isHidden: false },
            { args: ['anagram', 'mangaar'], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'atln-12',
        company: 'atlassian',
        category: 'product',
        number: 12,
        title: 'Ransom Note Character Availability',
        difficulty: 'Easy',
        topic: 'Hash Map',
        frequency: '84% in Atlassian Screening',
        context: 'Checking if template string has enough characters to render message',
        fnName: 'solve',
        params: [{ name: 'ransomNote', type: 'string' }, { name: 'magazine', type: 'string' }],
        returnType: 'boolean',
        description: 'Given strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed using characters from `magazine` (each character used at most once).',
        constraints: ['1 <= ransomNote.length, magazine.length <= 10^5'],
        hint: 'Count characters in magazine and verify each character in ransomNote has count >= 1.',
        starter: {
            python: 'def solve(ransomNote, magazine):\n    # Write your logic here\n    return False',
            javascript: 'function solve(ransomNote, magazine) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(ransomNote, magazine):\n    from collections import Counter\n    cm = Counter(magazine)\n    for ch in ransomNote:\n        if cm[ch] <= 0: return False\n        cm[ch] -= 1\n    return True',
            javascript: 'function solve(ransomNote, magazine) {\n    const cm = new Map();\n    for (const ch of magazine) cm.set(ch, (cm.get(ch) || 0) + 1);\n    for (const ch of ransomNote) {\n        if (!cm.get(ch)) return false;\n        cm.set(ch, cm.get(ch) - 1);\n    }\n    return true;\n}'
        },
        testCases: [
            { args: ['a', 'b'], expected: false, isHidden: false },
            { args: ['aa', 'ab'], expected: false, isHidden: false },
            { args: ['aa', 'aab'], expected: true, isHidden: true }
        ]
    },
    {
        id: 'atln-13',
        company: 'atlassian',
        category: 'product',
        number: 13,
        title: 'Single Element in a Sorted Array',
        difficulty: 'Medium',
        topic: 'Binary Search',
        frequency: '89% in Atlassian Technical Round',
        context: 'Finding lone un-replicated shard ID in sorted paired replica list',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given a sorted array `nums` where every element appears exactly twice except for one element which appears once, return that single element in `O(log n)` time.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Binary search on even indices: if nums[mid] == nums[mid ^ 1], the single element is to the right.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    lo, hi = 0, len(nums) - 1\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if mid % 2 == 1: mid -= 1\n        if nums[mid] == nums[mid + 1]: lo = mid + 2\n        else: hi = mid\n    return nums[lo]',
            javascript: 'function solve(nums) {\n    let lo = 0, hi = nums.length - 1;\n    while (lo < hi) {\n        let mid = (lo + hi) >> 1;\n        if (mid % 2 === 1) mid--;\n        if (nums[mid] === nums[mid + 1]) lo = mid + 2;\n        else hi = mid;\n    }\n    return nums[lo];\n}'
        },
        testCases: [
            { args: [[1, 1, 2, 3, 3, 4, 4, 8, 8]], expected: 2, isHidden: false },
            { args: [[3, 3, 7, 7, 10, 11, 11]], expected: 10, isHidden: false },
            { args: [[42]], expected: 42, isHidden: true }
        ]
    },
    {
        id: 'atln-14',
        company: 'atlassian',
        category: 'product',
        number: 14,
        title: 'Merge Strings Alternately',
        difficulty: 'Easy',
        topic: 'Two Pointers',
        frequency: '85% in Atlassian Screening',
        context: 'Interleaving two user activity streams token-by-token',
        fnName: 'solve',
        params: [{ name: 'word1', type: 'string' }, { name: 'word2', type: 'string' }],
        returnType: 'string',
        description: 'You are given two strings `word1` and `word2`. Merge them by adding letters in alternating order, starting with `word1`, and append any remaining characters at the end.',
        constraints: ['1 <= word1.length, word2.length <= 100'],
        hint: 'Loop i from 0 to max(len(word1), len(word2)) - 1 appending word1[i] and word2[i] when in bounds.',
        starter: {
            python: 'def solve(word1, word2):\n    # Write your logic here\n    return ""',
            javascript: 'function solve(word1, word2) {\n    // Write your logic here\n    return "";\n}'
        },
        solution: {
            python: 'def solve(word1, word2):\n    res = []\n    for i in range(max(len(word1), len(word2))):\n        if i < len(word1): res.append(word1[i])\n        if i < len(word2): res.append(word2[i])\n    return "".join(res)',
            javascript: 'function solve(word1, word2) {\n    let res = "";\n    const n = Math.max(word1.length, word2.length);\n    for (let i = 0; i < n; i++) {\n        if (i < word1.length) res += word1[i];\n        if (i < word2.length) res += word2[i];\n    }\n    return res;\n}'
        },
        testCases: [
            { args: ['abc', 'pqr'], expected: 'apbqcr', isHidden: false },
            { args: ['ab', 'pqrs'], expected: 'apbqrs', isHidden: false },
            { args: ['abcd', 'pq'], expected: 'apbqcd', isHidden: true }
        ]
    },
    {
        id: 'atln-15',
        company: 'atlassian',
        category: 'product',
        number: 15,
        title: 'Minimum Time to Type Word Using Special Typewriter',
        difficulty: 'Easy',
        topic: 'Greedy & Strings',
        frequency: '84% in Atlassian OA',
        context: 'Shortest circular dial rotation to type shortcut command sequence',
        fnName: 'solve',
        params: [{ name: 'word', type: 'string' }],
        returnType: 'int',
        description: 'A circular typewriter has lowercase letters `a` to `z` arranged in a ring with the pointer starting at `a`. Moving 1 letter clockwise/counterclockwise takes 1s, and typing a letter takes 1s. Return minimum seconds to type `word`.',
        constraints: ['1 <= word.length <= 100'],
        hint: 'For each character, move distance = min(|cur - nxt|, 26 - |cur - nxt|), plus 1 second to type.',
        starter: {
            python: 'def solve(word):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(word) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(word):\n    cur = 0\n    ans = 0\n    for ch in word:\n        nxt = ord(ch) - ord("a")\n        d = abs(nxt - cur)\n        ans += min(d, 26 - d) + 1\n        cur = nxt\n    return ans',
            javascript: 'function solve(word) {\n    let cur = 0, ans = 0;\n    for (const ch of word) {\n        const nxt = ch.charCodeAt(0) - 97;\n        const d = Math.abs(nxt - cur);\n        ans += Math.min(d, 26 - d) + 1;\n        cur = nxt;\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: ['abc'], expected: 5, isHidden: false },
            { args: ['bza'], expected: 7, isHidden: false },
            { args: ['zjpc'], expected: 34, isHidden: true }
        ]
    },
    {
        id: 'atln-16',
        company: 'atlassian',
        category: 'product',
        number: 16,
        title: 'Find All Numbers Disappeared in an Array',
        difficulty: 'Easy',
        topic: 'In-Place Array Indexing',
        frequency: '86% in Atlassian Screening',
        context: 'Detecting missing sprint ticket numbers in 1..N range',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given an array `nums` of `n` integers where `nums[i]` is in `[1, n]`, return an array of all the integers in `[1, n]` that do not appear in `nums` (in ascending order).',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Mark index |x| - 1 as negative, or use a set of size n.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return []',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(nums):\n    present = set(nums)\n    return [i for i in range(1, len(nums) + 1) if i not in present]',
            javascript: 'function solve(nums) {\n    const present = new Set(nums), res = [];\n    for (let i = 1; i <= nums.length; i++) if (!present.has(i)) res.push(i);\n    return res;\n}'
        },
        testCases: [
            { args: [[4, 3, 2, 7, 8, 2, 3, 1]], expected: [5, 6], isHidden: false },
            { args: [[1, 1]], expected: [2], isHidden: false },
            { args: [[1, 2, 3]], expected: [], isHidden: true }
        ]
    },
    {
        id: 'atln-17',
        company: 'atlassian',
        category: 'product',
        number: 17,
        title: 'Maximum Ice Cream Bars Purchasable',
        difficulty: 'Medium',
        topic: 'Greedy & Sorting',
        frequency: '85% in Atlassian OA',
        context: 'Maximizing number of Jira add-on plugins bought within budget',
        fnName: 'solve',
        params: [{ name: 'costs', type: 'int[]' }, { name: 'coins', type: 'int' }],
        returnType: 'int',
        description: 'Given `costs` of `n` items and `coins` budget, return the maximum number of items you can buy.',
        constraints: ['1 <= costs.length <= 10^5'],
        hint: 'Sort costs ascending and greedily buy the cheapest items first.',
        starter: {
            python: 'def solve(costs, coins):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(costs, coins) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(costs, coins):\n    cnt = 0\n    for c in sorted(costs):\n        if coins < c: break\n        coins -= c\n        cnt += 1\n    return cnt',
            javascript: 'function solve(costs, coins) {\n    let cnt = 0, rem = coins;\n    for (const c of [...costs].sort((a, b) => a - b)) {\n        if (rem < c) break;\n        rem -= c; cnt++;\n    }\n    return cnt;\n}'
        },
        testCases: [
            { args: [[1, 3, 2, 4, 1], 7], expected: 4, isHidden: false },
            { args: [[10, 6, 8, 7, 7, 8], 5], expected: 0, isHidden: false },
            { args: [[1, 6, 3, 1, 2, 5], 20], expected: 6, isHidden: true }
        ]
    },
    {
        id: 'atln-18',
        company: 'atlassian',
        category: 'product',
        number: 18,
        title: 'Minimum Absolute Difference Pairs',
        difficulty: 'Easy',
        topic: 'Sorting',
        frequency: '84% in Atlassian Screening',
        context: 'Finding closest timestamp pairs in sorted audit events',
        fnName: 'solve',
        params: [{ name: 'arr', type: 'int[]' }],
        returnType: 'int[][]',
        description: 'Given an array of distinct integers `arr`, find all pairs of elements `[a, b]` (`a < b`) with the minimum absolute difference `b - a`, returned in ascending order.',
        constraints: ['2 <= arr.length <= 10^5'],
        hint: 'Sort arr, find min adjacent difference, and collect all adjacent pairs matching that minimum difference.',
        starter: {
            python: 'def solve(arr):\n    # Write your logic here\n    return []',
            javascript: 'function solve(arr) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(arr):\n    a = sorted(arr)\n    md = min(a[i] - a[i - 1] for i in range(1, len(a)))\n    return [[a[i - 1], a[i]] for i in range(1, len(a)) if a[i] - a[i - 1] == md]',
            javascript: 'function solve(arr) {\n    const a = [...arr].sort((x, y) => x - y);\n    let md = Infinity;\n    for (let i = 1; i < a.length; i++) md = Math.min(md, a[i] - a[i - 1]);\n    const res = [];\n    for (let i = 1; i < a.length; i++) if (a[i] - a[i - 1] === md) res.push([a[i - 1], a[i]]);\n    return res;\n}'
        },
        testCases: [
            { args: [[4, 2, 1, 3]], expected: [[1, 2], [2, 3], [3, 4]], isHidden: false },
            { args: [[1, 3, 6, 10, 15]], expected: [[1, 3]], isHidden: false },
            { args: [[3, 8, -10, 23, 19, -4, -14, 27]], expected: [[-14, -10], [19, 23], [23, 27]], isHidden: true }
        ]
    },
    {
        id: 'atln-19',
        company: 'atlassian',
        category: 'product',
        number: 19,
        title: 'Can Place Flowers in Adjacent Bed',
        difficulty: 'Easy',
        topic: 'Greedy',
        frequency: '85% in Atlassian Screening',
        context: 'Scheduling non-adjacent maintenance slots in a 0/1 calendar',
        fnName: 'solve',
        params: [{ name: 'flowerbed', type: 'int[]' }, { name: 'n', type: 'int' }],
        returnType: 'boolean',
        description: 'Given a binary array `flowerbed` (`1` = planted, `0` = empty) where no two `1`s may be adjacent, return `true` if `n` new flowers can be planted without violating the no-adjacent rule.',
        constraints: ['1 <= flowerbed.length <= 2 * 10^4'],
        hint: 'Scan left to right; if flowerbed[i] == 0 and left and right neighbors are 0 (or out of bounds), plant greedily.',
        starter: {
            python: 'def solve(flowerbed, n):\n    # Write your logic here\n    return False',
            javascript: 'function solve(flowerbed, n) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(flowerbed, n):\n    f = list(flowerbed)\n    cnt = 0\n    for i in range(len(f)):\n        if f[i] == 0 and (i == 0 or f[i - 1] == 0) and (i == len(f) - 1 or f[i + 1] == 0):\n            f[i] = 1\n            cnt += 1\n    return cnt >= n',
            javascript: 'function solve(flowerbed, n) {\n    const f = [...flowerbed];\n    let cnt = 0;\n    for (let i = 0; i < f.length; i++) {\n        if (f[i] === 0 && (i === 0 || f[i - 1] === 0) && (i === f.length - 1 || f[i + 1] === 0)) {\n            f[i] = 1; cnt++;\n        }\n    }\n    return cnt >= n;\n}'
        },
        testCases: [
            { args: [[1, 0, 0, 0, 1], 1], expected: true, isHidden: false },
            { args: [[1, 0, 0, 0, 1], 2], expected: false, isHidden: false },
            { args: [[0, 0, 1, 0, 0], 2], expected: true, isHidden: true }
        ]
    },
    {
        id: 'atln-20',
        company: 'atlassian',
        category: 'product',
        number: 20,
        title: 'Minimum Index Sum of Two Lists',
        difficulty: 'Easy',
        topic: 'Hash Map',
        frequency: '84% in Atlassian P3',
        context: 'Finding highest-priority shared tool between two team preference lists',
        fnName: 'solve',
        params: [{ name: 'list1', type: 'string[]' }, { name: 'list2', type: 'string[]' }],
        returnType: 'string[]',
        description: 'Given two string arrays `list1` and `list2`, find all common strings with the least index sum `i + j`, returned in the order they appear in `list2`.',
        constraints: ['1 <= list1.length, list2.length <= 1000'],
        hint: 'Store index of each string in list1 in a map, then scan list2 tracking the minimum i + j.',
        starter: {
            python: 'def solve(list1, list2):\n    # Write your logic here\n    return []',
            javascript: 'function solve(list1, list2) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(list1, list2):\n    idx1 = {s: i for i, s in enumerate(list1)}\n    best, res = float("inf"), []\n    for j, s in enumerate(list2):\n        if s in idx1:\n            sm = idx1[s] + j\n            if sm < best: best = sm; res = [s]\n            elif sm == best: res.append(s)\n    return res',
            javascript: 'function solve(list1, list2) {\n    const idx1 = new Map(list1.map((s, i) => [s, i]));\n    let best = Infinity, res = [];\n    for (let j = 0; j < list2.length; j++) {\n        const s = list2[j];\n        if (idx1.has(s)) {\n            const sm = idx1.get(s) + j;\n            if (sm < best) { best = sm; res = [s]; }\n            else if (sm === best) res.push(s);\n        }\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [['Shogun', 'Tapioca Express', 'Burger King', 'KFC'], ['Piatti', 'The Grill at Torrey Pines', 'Hungry Hunter Steakhouse', 'Shogun']], expected: ['Shogun'], isHidden: false },
            { args: [['happy', 'sad', 'good'], ['sad', 'happy', 'good']], expected: ['sad', 'happy'], isHidden: false },
            { args: [['a', 'b'], ['b', 'a']], expected: ['b', 'a'], isHidden: true }
        ]
    }
];

