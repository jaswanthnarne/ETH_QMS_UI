export const META_QUESTIONS = [
    {
        id: 'meta-1',
        company: 'meta',
        category: 'product',
        number: 1,
        title: 'Buildings With an Ocean View',
        difficulty: 'Medium',
        topic: 'Monotonic Stack',
        frequency: '98% in Meta E3/E4 Phone Screen',
        context: 'Horizon visibility scan across coastal server racks',
        fnName: 'solve',
        params: [{ name: 'heights', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given an integer array `heights` of `n` buildings where the ocean is to the right of the buildings. A building has an ocean view if all the buildings to its right have a strictly smaller height. Return a sorted list of 0-based indices of buildings that have an ocean view.',
        constraints: ['1 <= heights.length <= 10^5', '1 <= heights[i] <= 10^9'],
        hint: 'Traverse from right to left keeping track of the maximum height seen so far.',
        starter: {
            python: 'def solve(heights):\n    # Write your logic here\n    return []',
            javascript: 'function solve(heights) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(heights):\n    res = []\n    max_h = 0\n    for i in range(len(heights) - 1, -1, -1):\n        if heights[i] > max_h:\n            res.append(i)\n            max_h = heights[i]\n    res.reverse()\n    return res',
            javascript: 'function solve(heights) {\n    const res = [];\n    let maxH = 0;\n    for (let i = heights.length - 1; i >= 0; i--) {\n        if (heights[i] > maxH) {\n            res.push(i);\n            maxH = heights[i];\n        }\n    }\n    return res.reverse();\n}'
        },
        testCases: [
            { args: [[4, 2, 3, 1]], expected: [0, 2, 3], isHidden: false },
            { args: [[4, 3, 2, 1]], expected: [0, 1, 2, 3], isHidden: false },
            { args: [[1, 3, 2, 4]], expected: [3], isHidden: true }
        ]
    },
    {
        id: 'meta-2',
        company: 'meta',
        category: 'product',
        number: 2,
        title: 'Simplify Unix Directory Path',
        difficulty: 'Medium',
        topic: 'Stack & Strings',
        frequency: '96% in Meta Coding Round',
        context: 'Canonicalizing distributed filesystem paths',
        fnName: 'solve',
        params: [{ name: 'path', type: 'string' }],
        returnType: 'string',
        description: 'Given an absolute Unix-style file `path` beginning with a slash `/`, convert it to its simplified canonical path. Treat `.` as current directory, `..` as parent directory, and collapse multiple consecutive slashes into a single slash.',
        constraints: ['1 <= path.length <= 3000'],
        hint: 'Split by "/" and use a stack: pop on "..", skip "" and ".", push valid directory names.',
        starter: {
            python: 'def solve(path):\n    # Write your logic here\n    return "/"',
            javascript: 'function solve(path) {\n    // Write your logic here\n    return "/";\n}'
        },
        solution: {
            python: 'def solve(path):\n    stack = []\n    for part in path.split("/"):\n        if part == "" or part == ".":\n            continue\n        elif part == "..":\n            if stack:\n                stack.pop()\n        else:\n            stack.append(part)\n    return "/" + "/".join(stack)',
            javascript: 'function solve(path) {\n    const stack = [];\n    for (const part of path.split("/")) {\n        if (!part || part === ".") continue;\n        if (part === "..") stack.pop();\n        else stack.push(part);\n    }\n    return "/" + stack.join("/");\n}'
        },
        testCases: [
            { args: ['/home//foo/'], expected: '/home/foo', isHidden: false },
            { args: ['/a/./b/../../c/'], expected: '/c', isHidden: false },
            { args: ['/../../'], expected: '/', isHidden: true }
        ]
    },
    {
        id: 'meta-3',
        company: 'meta',
        category: 'product',
        number: 3,
        title: 'Minimum Add to Make Parentheses Valid',
        difficulty: 'Medium',
        topic: 'Greedy & Stack',
        frequency: '95% in Meta Phone Screen',
        context: 'Balancing bracket expressions in query parser',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int',
        description: 'Given a parentheses string `s` consisting only of `(` and `)`, return the minimum number of parentheses you must insert at any positions to make the resulting string valid.',
        constraints: ['1 <= s.length <= 10^4'],
        hint: 'Track unmatched open "(" count and unmatched close ")" count in a single pass.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s):\n    open_need = 0\n    close_need = 0\n    for ch in s:\n        if ch == "(":\n            open_need += 1\n        elif open_need > 0:\n            open_need -= 1\n        else:\n            close_need += 1\n    return open_need + close_need',
            javascript: 'function solve(s) {\n    let openNeed = 0, closeNeed = 0;\n    for (const ch of s) {\n        if (ch === "(") openNeed++;\n        else if (openNeed > 0) openNeed--;\n        else closeNeed++;\n    }\n    return openNeed + closeNeed;\n}'
        },
        testCases: [
            { args: ['())'], expected: 1, isHidden: false },
            { args: ['((('], expected: 3, isHidden: false },
            { args: ['()))(('], expected: 4, isHidden: true }
        ]
    },
    {
        id: 'meta-4',
        company: 'meta',
        category: 'product',
        number: 4,
        title: 'Dot Product of Two Sparse Vectors',
        difficulty: 'Medium',
        topic: 'Hash Map & Arrays',
        frequency: '94% in Meta E4 Interview',
        context: 'Newsfeed ranking sparse embedding multiplication',
        fnName: 'solve',
        params: [{ name: 'nums1', type: 'int[]' }, { name: 'nums2', type: 'int[]' }],
        returnType: 'int',
        description: 'Given two sparse integer vectors `nums1` and `nums2` of equal length, compute their dot product efficiently by only multiplying non-zero entries.',
        constraints: ['1 <= nums1.length == nums2.length <= 10^5'],
        hint: 'Store non-zero (index, value) pairs of the smaller sparse representation and look up matching non-zero indices.',
        starter: {
            python: 'def solve(nums1, nums2):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums1, nums2) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums1, nums2):\n    nz1 = {i: v for i, v in enumerate(nums1) if v != 0}\n    return sum(v * nums2[i] for i, v in nz1.items() if nums2[i] != 0)',
            javascript: 'function solve(nums1, nums2) {\n    let total = 0;\n    for (let i = 0; i < nums1.length; i++) {\n        if (nums1[i] !== 0 && nums2[i] !== 0) total += nums1[i] * nums2[i];\n    }\n    return total;\n}'
        },
        testCases: [
            { args: [[1, 0, 0, 2, 3], [0, 3, 0, 4, 0]], expected: 8, isHidden: false },
            { args: [[0, 1, 0, 0, 0], [0, 0, 0, 0, 2]], expected: 0, isHidden: false },
            { args: [[0, 1, 0, 0, 2, 0, 0], [1, 0, 0, 0, 3, 0, 4]], expected: 6, isHidden: true }
        ]
    },
    {
        id: 'meta-5',
        company: 'meta',
        category: 'product',
        number: 5,
        title: 'Interval List Intersections',
        difficulty: 'Medium',
        topic: 'Two Pointers',
        frequency: '93% in Meta Onsite',
        context: 'Finding overlapping active time windows between two services',
        fnName: 'solve',
        params: [{ name: 'firstList', type: 'int[][]' }, { name: 'secondList', type: 'int[][]' }],
        returnType: 'int[][]',
        description: 'You are given two lists of closed disjoint sorted intervals `firstList` and `secondList`. Return the intersection of these two interval lists.',
        constraints: ['0 <= firstList.length, secondList.length <= 1000'],
        hint: 'Use two pointers i and j. Overlap exists when max(start1, start2) <= min(end1, end2). Advance the pointer with the smaller end.',
        starter: {
            python: 'def solve(firstList, secondList):\n    # Write your logic here\n    return []',
            javascript: 'function solve(firstList, secondList) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(firstList, secondList):\n    res = []\n    i = j = 0\n    while i < len(firstList) and j < len(secondList):\n        lo = max(firstList[i][0], secondList[j][0])\n        hi = min(firstList[i][1], secondList[j][1])\n        if lo <= hi:\n            res.append([lo, hi])\n        if firstList[i][1] < secondList[j][1]:\n            i += 1\n        else:\n            j += 1\n    return res',
            javascript: 'function solve(firstList, secondList) {\n    const res = [];\n    let i = 0, j = 0;\n    while (i < firstList.length && j < secondList.length) {\n        const lo = Math.max(firstList[i][0], secondList[j][0]);\n        const hi = Math.min(firstList[i][1], secondList[j][1]);\n        if (lo <= hi) res.push([lo, hi]);\n        if (firstList[i][1] < secondList[j][1]) i++;\n        else j++;\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [[[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]]], expected: [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]], isHidden: false },
            { args: [[[1, 3], [5, 9]], []], expected: [], isHidden: false },
            { args: [[[1, 7]], [[3, 10]]], expected: [[3, 7]], isHidden: true }
        ]
    },
    {
        id: 'meta-6',
        company: 'meta',
        category: 'product',
        number: 6,
        title: 'Basic Calculator II (Expression Evaluator)',
        difficulty: 'Medium',
        topic: 'Stack & Math',
        frequency: '92% in Meta Phone Screen',
        context: 'Evaluating arithmetic formulas without parentheses',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int',
        description: 'Given a string `s` representing a valid arithmetic expression containing non-negative integers, `+`, `-`, `*`, `/`, and spaces, evaluate it and return the integer value. Integer division should truncate toward zero.',
        constraints: ['1 <= s.length <= 10^5'],
        hint: 'Maintain the last operator and push numbers to a stack; apply * and / immediately against stack top.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s):\n    stack = []\n    num = 0\n    op = "+" \n    for i, ch in enumerate(s + "+"):\n        if ch.isdigit():\n            num = num * 10 + int(ch)\n        elif ch in "+-*/":\n            if op == "+": stack.append(num)\n            elif op == "-": stack.append(-num)\n            elif op == "*": stack.append(stack.pop() * num)\n            elif op == "/": stack.append(int(stack.pop() / num))\n            op = ch\n            num = 0\n    return sum(stack)',
            javascript: 'function solve(s) {\n    const stack = [];\n    let num = 0, op = "+";\n    const str = s + "+";\n    for (let i = 0; i < str.length; i++) {\n        const ch = str[i];\n        if (ch >= "0" && ch <= "9") num = num * 10 + Number(ch);\n        else if ("+-*/".includes(ch)) {\n            if (op === "+") stack.push(num);\n            else if (op === "-") stack.push(-num);\n            else if (op === "*") stack.push(stack.pop() * num);\n            else if (op === "/") stack.push(Math.trunc(stack.pop() / num));\n            op = ch;\n            num = 0;\n        }\n    }\n    return stack.reduce((a, b) => a + b, 0);\n}'
        },
        testCases: [
            { args: ['3+2*2'], expected: 7, isHidden: false },
            { args: [' 3/2 '], expected: 1, isHidden: false },
            { args: [' 3+5 / 2 '], expected: 5, isHidden: true }
        ]
    },
    {
        id: 'meta-7',
        company: 'meta',
        category: 'product',
        number: 7,
        title: 'Custom Sort String Order',
        difficulty: 'Medium',
        topic: 'Hash Map & Sorting',
        frequency: '91% in Meta E3/E4',
        context: 'Reordering feed tags according to custom priority schema',
        fnName: 'solve',
        params: [{ name: 'order', type: 'string' }, { name: 's', type: 'string' }],
        returnType: 'string',
        description: 'You are given two strings `order` and `s`. All characters of `order` are unique and were sorted in some custom order. Permute the characters of `s` so that they match the relative order of characters in `order`. Characters not in `order` can appear at the end in any order (sorted alphabetically here for determinism).',
        constraints: ['1 <= order.length <= 26', '1 <= s.length <= 200'],
        hint: 'Count frequencies of characters in s, append characters in order first, then remaining characters.',
        starter: {
            python: 'def solve(order, s):\n    # Write your logic here\n    return ""',
            javascript: 'function solve(order, s) {\n    // Write your logic here\n    return "";\n}'
        },
        solution: {
            python: 'def solve(order, s):\n    from collections import Counter\n    cnt = Counter(s)\n    res = []\n    for ch in order:\n        if ch in cnt:\n            res.append(ch * cnt.pop(ch))\n    for ch in sorted(cnt.keys()):\n        res.append(ch * cnt[ch])\n    return "".join(res)',
            javascript: 'function solve(order, s) {\n    const cnt = new Map();\n    for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1);\n    let res = "";\n    for (const ch of order) {\n        if (cnt.has(ch)) {\n            res += ch.repeat(cnt.get(ch));\n            cnt.delete(ch);\n        }\n    }\n    for (const ch of [...cnt.keys()].sort()) {\n        res += ch.repeat(cnt.get(ch));\n    }\n    return res;\n}'
        },
        testCases: [
            { args: ['cba', 'abcd'], expected: 'cbad', isHidden: false },
            { args: ['bcafg', 'abcd'], expected: 'bcad', isHidden: false },
            { args: ['kqep', 'pekeq'], expected: 'kqeep', isHidden: true }
        ]
    },
    {
        id: 'meta-8',
        company: 'meta',
        category: 'product',
        number: 8,
        title: 'Continuous Subarray Sum Multiple of K',
        difficulty: 'Medium',
        topic: 'Prefix Sum & Modulo',
        frequency: '90% in Meta Coding Interview',
        context: 'Detecting periodic batch checksums divisible by K',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'boolean',
        description: 'Given an integer array `nums` and an integer `k`, return `true` if `nums` has a good subarray of length at least 2 whose elements sum up to a multiple of `k`, or `false` otherwise.',
        constraints: ['1 <= nums.length <= 10^5', '1 <= k <= 2^31 - 1'],
        hint: 'Store the earliest index of each prefix sum modulo k. If the same remainder repeats at index j - i >= 2, return true.',
        starter: {
            python: 'def solve(nums, k):\n    # Write your logic here\n    return False',
            javascript: 'function solve(nums, k) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(nums, k):\n    seen = {0: -1}\n    pref = 0\n    for i, x in enumerate(nums):\n        pref = (pref + x) % k\n        if pref in seen:\n            if i - seen[pref] >= 2:\n                return True\n        else:\n            seen[pref] = i\n    return False',
            javascript: 'function solve(nums, k) {\n    const seen = new Map([[0, -1]]);\n    let pref = 0;\n    for (let i = 0; i < nums.length; i++) {\n        pref = (pref + nums[i]) % k;\n        if (seen.has(pref)) {\n            if (i - seen.get(pref) >= 2) return true;\n        } else {\n            seen.set(pref, i);\n        }\n    }\n    return false;\n}'
        },
        testCases: [
            { args: [[23, 2, 4, 6, 7], 6], expected: true, isHidden: false },
            { args: [[23, 2, 6, 4, 7], 13], expected: false, isHidden: false },
            { args: [[5, 0, 0, 0], 3], expected: true, isHidden: true }
        ]
    },
    {
        id: 'meta-9',
        company: 'meta',
        category: 'product',
        number: 9,
        title: 'Group Shifted Strings',
        difficulty: 'Medium',
        topic: 'Hashing & Strings',
        frequency: '89% in Meta E4',
        context: 'Clustering Caesar-shifted cipher identifiers',
        fnName: 'solve',
        params: [{ name: 'strings', type: 'string[]' }],
        returnType: 'int',
        description: 'Two strings belong to the same shifting sequence if one can be shifted circularly by a constant offset to form the other (e.g., "abc" and "bcd", or "az" and "ba"). Given an array of lowercase strings, return the number of distinct shifting groups.',
        constraints: ['1 <= strings.length <= 200'],
        hint: 'Normalize each string by computing (ord(c) - ord(s[0])) % 26 for every character and group by the resulting tuple.',
        starter: {
            python: 'def solve(strings):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(strings) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(strings):\n    groups = set()\n    for s in strings:\n        base = ord(s[0])\n        key = tuple((ord(c) - base) % 26 for c in s)\n        groups.add(key)\n    return len(groups)',
            javascript: 'function solve(strings) {\n    const groups = new Set();\n    for (const s of strings) {\n        const base = s.charCodeAt(0);\n        const key = [...s].map(c => (c.charCodeAt(0) - base + 26) % 26).join(",");\n        groups.add(key);\n    }\n    return groups.size;\n}'
        },
        testCases: [
            { args: [['abc', 'bcd', 'acef', 'xyz', 'az', 'ba', 'a', 'z']], expected: 4, isHidden: false },
            { args: [['a']], expected: 1, isHidden: false },
            { args: [['ab', 'ba', 'cd', 'xy']], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'meta-10',
        company: 'meta',
        category: 'product',
        number: 10,
        title: 'Kth Missing Positive Number',
        difficulty: 'Easy',
        topic: 'Binary Search',
        frequency: '88% in Meta Phone Screen',
        context: 'Locating missing sequence IDs in sorted event logs',
        fnName: 'solve',
        params: [{ name: 'arr', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given a strictly increasing array of positive integers `arr` and an integer `k`, return the `k`-th positive integer that is missing from this array.',
        constraints: ['1 <= arr.length <= 1000', '1 <= k <= 1000'],
        hint: 'At index i, there are arr[i] - i - 1 missing numbers before arr[i]. Binary search for the first index where missing >= k.',
        starter: {
            python: 'def solve(arr, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(arr, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(arr, k):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] - mid - 1 < k:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return lo + k',
            javascript: 'function solve(arr, k) {\n    let lo = 0, hi = arr.length - 1;\n    while (lo <= hi) {\n        const mid = (lo + hi) >> 1;\n        if (arr[mid] - mid - 1 < k) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return lo + k;\n}'
        },
        testCases: [
            { args: [[2, 3, 4, 7, 11], 5], expected: 9, isHidden: false },
            { args: [[1, 2, 3, 4], 2], expected: 6, isHidden: false },
            { args: [[5, 6, 7], 3], expected: 3, isHidden: true }
        ]
    },
    {
        id: 'meta-11',
        company: 'meta',
        category: 'product',
        number: 11,
        title: 'Valid Word Abbreviation Matcher',
        difficulty: 'Easy',
        topic: 'Two Pointers',
        frequency: '94% in Meta E3/E4',
        context: 'Validating compressed token schemas in API routing',
        fnName: 'solve',
        params: [{ name: 'word', type: 'string' }, { name: 'abbr', type: 'string' }],
        returnType: 'boolean',
        description: 'A string can be abbreviated by replacing any number of non-adjacent, non-empty substrings with their lengths (no leading zeros allowed). Given `word` and `abbr`, return `true` if `abbr` is a valid abbreviation of `word`.',
        constraints: ['1 <= word.length <= 100', '1 <= abbr.length <= 100'],
        hint: 'Walk both strings with two pointers; parse multi-digit numbers (rejecting leading "0") and advance word pointer.',
        starter: {
            python: 'def solve(word, abbr):\n    # Write your logic here\n    return False',
            javascript: 'function solve(word, abbr) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(word, abbr):\n    i = j = 0\n    while i < len(word) and j < len(abbr):\n        if abbr[j].isdigit():\n            if abbr[j] == "0":\n                return False\n            num = 0\n            while j < len(abbr) and abbr[j].isdigit():\n                num = num * 10 + int(abbr[j])\n                j += 1\n            i += num\n        else:\n            if word[i] != abbr[j]:\n                return False\n            i += 1\n            j += 1\n    return i == len(word) and j == len(abbr)',
            javascript: 'function solve(word, abbr) {\n    let i = 0, j = 0;\n    while (i < word.length && j < abbr.length) {\n        if (abbr[j] >= "0" && abbr[j] <= "9") {\n            if (abbr[j] === "0") return false;\n            let num = 0;\n            while (j < abbr.length && abbr[j] >= "0" && abbr[j] <= "9") {\n                num = num * 10 + Number(abbr[j]);\n                j++;\n            }\n            i += num;\n        } else {\n            if (word[i] !== abbr[j]) return false;\n            i++;\n            j++;\n        }\n    }\n    return i === word.length && j === abbr.length;\n}'
        },
        testCases: [
            { args: ['internationalization', 'i12iz4n'], expected: true, isHidden: false },
            { args: ['apple', 'a2e'], expected: false, isHidden: false },
            { args: ['substitution', 's010n'], expected: false, isHidden: true }
        ]
    },
    {
        id: 'meta-12',
        company: 'meta',
        category: 'product',
        number: 12,
        title: 'Exclusive Time of Functions',
        difficulty: 'Medium',
        topic: 'Stack & Simulation',
        frequency: '88% in Meta Infrastructure Round',
        context: 'Profiling CPU time spent inside nested RPC calls',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }, { name: 'logs', type: 'string[]' }],
        returnType: 'int[]',
        description: 'Given `n` functions and execution `logs` formatted as `"id:start:time"` or `"id:end:time"`, return an array of length `n` containing the exclusive execution time of each function.',
        constraints: ['1 <= n <= 100', '1 <= logs.length <= 500'],
        hint: 'Keep a call stack of function IDs and prevTime. Note that "end" timestamps are inclusive (+1).',
        starter: {
            python: 'def solve(n, logs):\n    # Write your logic here\n    return []',
            javascript: 'function solve(n, logs) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(n, logs):\n    res = [0] * n\n    stack = []\n    prev = 0\n    for log in logs:\n        fid, typ, ts = log.split(":")\n        fid, ts = int(fid), int(ts)\n        if typ == "start":\n            if stack:\n                res[stack[-1]] += ts - prev\n            stack.append(fid)\n            prev = ts\n        else:\n            res[stack.pop()] += ts - prev + 1\n            prev = ts + 1\n    return res',
            javascript: 'function solve(n, logs) {\n    const res = new Array(n).fill(0);\n    const stack = [];\n    let prev = 0;\n    for (const log of logs) {\n        const [fidStr, typ, tsStr] = log.split(":");\n        const fid = Number(fidStr), ts = Number(tsStr);\n        if (typ === "start") {\n            if (stack.length) res[stack[stack.length - 1]] += ts - prev;\n            stack.push(fid);\n            prev = ts;\n        } else {\n            res[stack.pop()] += ts - prev + 1;\n            prev = ts + 1;\n        }\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [2, ['0:start:0', '1:start:2', '1:end:5', '0:end:6']], expected: [3, 4], isHidden: false },
            { args: [1, ['0:start:0', '0:start:2', '0:end:5', '0:start:6', '0:end:6', '0:end:7']], expected: [8], isHidden: false },
            { args: [2, ['0:start:0', '0:start:2', '0:end:5', '1:start:6', '1:end:6', '0:end:7']], expected: [7, 1], isHidden: true }
        ]
    },
    {
        id: 'meta-13',
        company: 'meta',
        category: 'product',
        number: 13,
        title: 'Next Greater Permutation',
        difficulty: 'Medium',
        topic: 'Arrays & Greedy',
        frequency: '87% in Meta E3/E4',
        context: 'Generating the next lexicographical shard ordering',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given an array of integers `nums`, return its next lexicographically greater permutation. If no greater permutation exists (array is descending), return the lowest possible order (ascending).',
        constraints: ['1 <= nums.length <= 100'],
        hint: 'Find the rightmost index i with nums[i] < nums[i+1], swap with the rightmost element > nums[i], then reverse the suffix.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return []',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(nums):\n    a = list(nums)\n    i = len(a) - 2\n    while i >= 0 and a[i] >= a[i + 1]:\n        i -= 1\n    if i >= 0:\n        j = len(a) - 1\n        while a[j] <= a[i]:\n            j -= 1\n        a[i], a[j] = a[j], a[i]\n    a[i + 1:] = reversed(a[i + 1:])\n    return a',
            javascript: 'function solve(nums) {\n    const a = [...nums];\n    let i = a.length - 2;\n    while (i >= 0 && a[i] >= a[i + 1]) i--;\n    if (i >= 0) {\n        let j = a.length - 1;\n        while (a[j] <= a[i]) j--;\n        [a[i], a[j]] = [a[j], a[i]];\n    }\n    let l = i + 1, r = a.length - 1;\n    while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; }\n    return a;\n}'
        },
        testCases: [
            { args: [[1, 2, 3]], expected: [1, 3, 2], isHidden: false },
            { args: [[3, 2, 1]], expected: [1, 2, 3], isHidden: false },
            { args: [[1, 1, 5]], expected: [1, 5, 1], isHidden: true }
        ]
    },
    {
        id: 'meta-14',
        company: 'meta',
        category: 'product',
        number: 14,
        title: 'Pow(x, n) Binary Exponentiation',
        difficulty: 'Medium',
        topic: 'Math & Recursion',
        frequency: '89% in Meta Phone Screen',
        context: 'Fast floating-point exponentiation for decay weights',
        fnName: 'solve',
        params: [{ name: 'x', type: 'float' }, { name: 'n', type: 'int' }],
        returnType: 'float',
        description: 'Implement `pow(x, n)`, which calculates `x` raised to the power `n`, rounded to 5 decimal places.',
        constraints: ['-100.0 < x < 100.0', '-2^31 <= n <= 2^31 - 1'],
        hint: 'Use binary exponentiation by squaring x and halving |n|.',
        starter: {
            python: 'def solve(x, n):\n    # Write your logic here\n    return 0.0',
            javascript: 'function solve(x, n) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(x, n):\n    if n < 0:\n        x = 1 / x\n        n = -n\n    ans = 1.0\n    while n > 0:\n        if n & 1:\n            ans *= x\n        x *= x\n        n >>= 1\n    return round(ans, 5)',
            javascript: 'function solve(x, n) {\n    let exp = n;\n    let base = x;\n    if (exp < 0) { base = 1 / base; exp = -exp; }\n    let ans = 1;\n    while (exp > 0) {\n        if (exp % 2 === 1) ans *= base;\n        base *= base;\n        exp = Math.floor(exp / 2);\n    }\n    return Number(ans.toFixed(5));\n}'
        },
        testCases: [
            { args: [2.0, 10], expected: 1024, isHidden: false },
            { args: [2.1, 3], expected: 9.261, isHidden: false },
            { args: [2.0, -2], expected: 0.25, isHidden: true }
        ]
    },
    {
        id: 'meta-15',
        company: 'meta',
        category: 'product',
        number: 15,
        title: 'Max Consecutive Ones III (K Flips)',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        frequency: '90% in Meta Coding Round',
        context: 'Longest active uptime window allowing K transient faults',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`s in the array if you can flip at most `k` `0`s.',
        constraints: ['1 <= nums.length <= 10^5', '0 <= k <= nums.length'],
        hint: 'Expand right pointer; whenever zeroCount > k, shrink left pointer until zeroCount <= k.',
        starter: {
            python: 'def solve(nums, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums, k):\n    l = zeros = best = 0\n    for r, v in enumerate(nums):\n        if v == 0: zeros += 1\n        while zeros > k:\n            if nums[l] == 0: zeros -= 1\n            l += 1\n        best = max(best, r - l + 1)\n    return best',
            javascript: 'function solve(nums, k) {\n    let l = 0, zeros = 0, best = 0;\n    for (let r = 0; r < nums.length; r++) {\n        if (nums[r] === 0) zeros++;\n        while (zeros > k) {\n            if (nums[l] === 0) zeros--;\n            l++;\n        }\n        best = Math.max(best, r - l + 1);\n    }\n    return best;\n}'
        },
        testCases: [
            { args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], expected: 6, isHidden: false },
            { args: [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], expected: 10, isHidden: false },
            { args: [[0, 0, 0, 0], 2], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'meta-16',
        company: 'meta',
        category: 'product',
        number: 16,
        title: 'Minimum Remove to Make Valid Parentheses',
        difficulty: 'Medium',
        topic: 'Stack & Strings',
        frequency: '99% in Meta Most Asked',
        context: 'Sanitizing malformed user search filter syntax',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'string',
        description: 'Given a string `s` of `(`, `)`, and lowercase English characters, remove the minimum number of parentheses so that the resulting parentheses string is valid, and return the resulting string.',
        constraints: ['1 <= s.length <= 10^5'],
        hint: 'Use a stack of indices of unmatched "(" and a set of unmatched ")" indices; rebuild excluding those indices.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return ""',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return "";\n}'
        },
        solution: {
            python: 'def solve(s):\n    stack = []\n    remove = set()\n    for i, ch in enumerate(s):\n        if ch == "(":\n            stack.append(i)\n        elif ch == ")":\n            if stack:\n                stack.pop()\n            else:\n                remove.add(i)\n    remove.update(stack)\n    return "".join(ch for i, ch in enumerate(s) if i not in remove)',
            javascript: 'function solve(s) {\n    const stack = [], remove = new Set();\n    for (let i = 0; i < s.length; i++) {\n        if (s[i] === "(") stack.push(i);\n        else if (s[i] === ")") {\n            if (stack.length) stack.pop();\n            else remove.add(i);\n        }\n    }\n    for (const idx of stack) remove.add(idx);\n    let res = "";\n    for (let i = 0; i < s.length; i++) if (!remove.has(i)) res += s[i];\n    return res;\n}'
        },
        testCases: [
            { args: ['lee(t(c)o)de)'], expected: 'lee(t(c)o)de', isHidden: false },
            { args: ['a)b(c)d'], expected: 'ab(c)d', isHidden: false },
            { args: ['))(('], expected: '', isHidden: true }
        ]
    },
    {
        id: 'meta-17',
        company: 'meta',
        category: 'product',
        number: 17,
        title: 'Merge Sorted Array Without Extra Space',
        difficulty: 'Easy',
        topic: 'Two Pointers',
        frequency: '92% in Meta Phone Screen',
        context: 'Combining two sorted friend recommendation lists',
        fnName: 'solve',
        params: [{ name: 'nums1', type: 'int[]' }, { name: 'm', type: 'int' }, { name: 'nums2', type: 'int[]' }, { name: 'n', type: 'int' }],
        returnType: 'int[]',
        description: 'Given two sorted integer arrays `nums1` (with length `m + n`, where the first `m` elements are valid and last `n` are `0`) and `nums2` (length `n`), merge `nums2` into `nums1` in sorted order and return the merged array.',
        constraints: ['0 <= m, n <= 200'],
        hint: 'Merge backwards from index m + n - 1 using pointers at m - 1 and n - 1.',
        starter: {
            python: 'def solve(nums1, m, nums2, n):\n    # Write your logic here\n    return []',
            javascript: 'function solve(nums1, m, nums2, n) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(nums1, m, nums2, n):\n    res = list(nums1)\n    i, j, k = m - 1, n - 1, m + n - 1\n    while j >= 0:\n        if i >= 0 and res[i] > nums2[j]:\n            res[k] = res[i]\n            i -= 1\n        else:\n            res[k] = nums2[j]\n            j -= 1\n        k -= 1\n    return res',
            javascript: 'function solve(nums1, m, nums2, n) {\n    const res = [...nums1];\n    let i = m - 1, j = n - 1, k = m + n - 1;\n    while (j >= 0) {\n        if (i >= 0 && res[i] > nums2[j]) res[k--] = res[i--];\n        else res[k--] = nums2[j--];\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6], isHidden: false },
            { args: [[1], 1, [], 0], expected: [1], isHidden: false },
            { args: [[0], 0, [1], 1], expected: [1], isHidden: true }
        ]
    },
    {
        id: 'meta-18',
        company: 'meta',
        category: 'product',
        number: 18,
        title: 'Subarray Sum Equals Target Count',
        difficulty: 'Medium',
        topic: 'Prefix Sum & Hash Map',
        frequency: '97% in Meta E3/E4',
        context: 'Counting contiguous engagement spikes matching target sum',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given an integer array `nums` and an integer `k`, return the total number of contiguous subarrays whose sum equals `k`.',
        constraints: ['1 <= nums.length <= 2 * 10^4'],
        hint: 'Track prefix sum frequencies in a map and add freq[currSum - k] at each step.',
        starter: {
            python: 'def solve(nums, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums, k):\n    freq = {0: 1}\n    curr = ans = 0\n    for x in nums:\n        curr += x\n        ans += freq.get(curr - k, 0)\n        freq[curr] = freq.get(curr, 0) + 1\n    return ans',
            javascript: 'function solve(nums, k) {\n    const freq = new Map([[0, 1]]);\n    let curr = 0, ans = 0;\n    for (const x of nums) {\n        curr += x;\n        ans += freq.get(curr - k) || 0;\n        freq.set(curr, (freq.get(curr) || 0) + 1);\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[1, 1, 1], 2], expected: 2, isHidden: false },
            { args: [[1, 2, 3], 3], expected: 2, isHidden: false },
            { args: [[1, -1, 0], 0], expected: 3, isHidden: true }
        ]
    },
    {
        id: 'meta-19',
        company: 'meta',
        category: 'product',
        number: 19,
        title: 'Add Binary Strings',
        difficulty: 'Easy',
        topic: 'Strings & Bit Math',
        frequency: '86% in Meta E3 Screening',
        context: 'Summing arbitrary-length binary feature bitmasks',
        fnName: 'solve',
        params: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string' }],
        returnType: 'string',
        description: 'Given two binary strings `a` and `b`, return their sum as a binary string.',
        constraints: ['1 <= a.length, b.length <= 10^4'],
        hint: 'Add from right to left maintaining a carry bit.',
        starter: {
            python: 'def solve(a, b):\n    # Write your logic here\n    return "0"',
            javascript: 'function solve(a, b) {\n    // Write your logic here\n    return "0";\n}'
        },
        solution: {
            python: 'def solve(a, b):\n    i, j, carry = len(a) - 1, len(b) - 1, 0\n    res = []\n    while i >= 0 or j >= 0 or carry:\n        s = carry\n        if i >= 0: s += int(a[i]); i -= 1\n        if j >= 0: s += int(b[j]); j -= 1\n        res.append(str(s % 2))\n        carry = s // 2\n    return "".join(reversed(res))',
            javascript: 'function solve(a, b) {\n    let i = a.length - 1, j = b.length - 1, carry = 0;\n    const res = [];\n    while (i >= 0 || j >= 0 || carry) {\n        let s = carry;\n        if (i >= 0) s += Number(a[i--]);\n        if (j >= 0) s += Number(b[j--]);\n        res.push(String(s % 2));\n        carry = Math.floor(s / 2);\n    }\n    return res.reverse().join("");\n}'
        },
        testCases: [
            { args: ['11', '1'], expected: '100', isHidden: false },
            { args: ['1010', '1011'], expected: '10101', isHidden: false },
            { args: ['0', '0'], expected: '0', isHidden: true }
        ]
    },
    {
        id: 'meta-20',
        company: 'meta',
        category: 'product',
        number: 20,
        title: 'Toeplitz Matrix Validator',
        difficulty: 'Easy',
        topic: 'Matrix',
        frequency: '85% in Meta Phone Screen',
        context: 'Checking diagonal consistency across convolution kernels',
        fnName: 'solve',
        params: [{ name: 'matrix', type: 'int[][]' }],
        returnType: 'boolean',
        description: 'Given an `m x n` `matrix`, return `true` if the matrix is Toeplitz (every diagonal from top-left to bottom-right has the same elements), otherwise `false`.',
        constraints: ['1 <= m, n <= 20'],
        hint: 'Compare every element matrix[r][c] with matrix[r - 1][c - 1] for r >= 1, c >= 1.',
        starter: {
            python: 'def solve(matrix):\n    # Write your logic here\n    return False',
            javascript: 'function solve(matrix) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(matrix):\n    for r in range(1, len(matrix)):\n        for c in range(1, len(matrix[0])):\n            if matrix[r][c] != matrix[r - 1][c - 1]:\n                return False\n    return True',
            javascript: 'function solve(matrix) {\n    for (let r = 1; r < matrix.length; r++) {\n        for (let c = 1; c < matrix[0].length; c++) {\n            if (matrix[r][c] !== matrix[r - 1][c - 1]) return false;\n        }\n    }\n    return true;\n}'
        },
        testCases: [
            { args: [[[1, 2, 3, 4], [5, 1, 2, 3], [9, 5, 1, 2]]], expected: true, isHidden: false },
            { args: [[[1, 2], [2, 2]]], expected: false, isHidden: false },
            { args: [[[7]]], expected: true, isHidden: true }
        ]
    }
];

