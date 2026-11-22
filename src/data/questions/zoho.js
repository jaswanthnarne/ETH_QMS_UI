export const ZOHO_QUESTIONS = [
    {
        "id": "zoho-1",
        "company": "zoho",
        "category": "fintech",
        "number": 1,
        "title": "Custom Substring Index Search without IndexOf",
        "difficulty": "Easy",
        "topic": "String Matching",
        "frequency": "99% in Zoho Level 2 & 3",
        "context": "Zoho Writer raw text search engine",
        "fnName": "solve",
        "params": [
            {
                "name": "haystack",
                "type": "string"
            },
            {
                "name": "needle",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Find the first occurrence index of string `needle` in `haystack`. If `needle` is not part of `haystack`, return `-1`. If `needle` is empty, return `0`. (Implemented manually without built-in indexOf / find).",
        "constraints": [
            "0 <= haystack.length, needle.length <= 10^4"
        ],
        "hint": "Two pointer character comparison loop.",
        "starter": {
            "python": "def solve(haystack, needle):\n    # Write your logic here\n    return -1",
            "javascript": "function solve(haystack, needle) {\n    // Write your logic here\n    return -1;\n}"
        },
        "solution": {
            "python": "def solve(haystack, needle):\n    if not needle: return 0\n    n, m = len(haystack), len(needle)\n    for i in range(n - m + 1):\n        match = True\n        for j in range(m):\n            if haystack[i + j] != needle[j]:\n                match = False\n                break\n        if match: return i\n    return -1",
            "javascript": "function solve(haystack, needle) {\n    if (needle.length === 0) return 0;\n    const n = haystack.length, m = needle.length;\n    for (let i = 0; i <= n - m; i++) {\n        let match = true;\n        for (let j = 0; j < m; j++) {\n            if (haystack[i + j] !== needle[j]) { match = false; break; }\n        }\n        if (match) return i;\n    }\n    return -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    "zohocorptechnologies",
                    "corp"
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    "developer",
                    "code"
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-2",
        "company": "zoho",
        "category": "fintech",
        "number": 2,
        "title": "Expand Encoded String by Character Multipliers",
        "difficulty": "Medium",
        "topic": "String Parsing",
        "frequency": "98% in Zoho Round 2",
        "context": "Zoho CRM decompression parser (e.g. 'a1b10' -> 'abbbbbbbbbb')",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given a string where characters are followed by one or more digits representing their repetition count (e.g. `a1b10c2`), return the expanded string (`abbbbbbbbbbcc`).",
        "constraints": [
            "1 <= s.length <= 100",
            "Count digits >= 1"
        ],
        "hint": "Parse letter followed by consecutive digits.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(s):\n    res = []\n    i = 0\n    while i < len(s):\n        char = s[i]\n        i += 1\n        count = 0\n        while i < len(s) and s[i].isdigit():\n            count = count * 10 + int(s[i])\n            i += 1\n        res.append(char * count)\n    return ''.join(res)",
            "javascript": "function solve(s) {\n    let res = '';\n    let i = 0;\n    while (i < s.length) {\n        const char = s[i++];\n        let count = 0;\n        while (i < s.length && s[i] >= '0' && s[i] <= '9') {\n            count = count * 10 + parseInt(s[i++], 10);\n        }\n        res += char.repeat(count);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    "a1b10"
                ],
                "expected": "abbbbbbbbbb",
                "isHidden": false
            },
            {
                "args": [
                    "b3c6d15"
                ],
                "expected": "bbbccccccddddddddddddddd",
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-3",
        "company": "zoho",
        "category": "fintech",
        "number": 3,
        "title": "Snake Matrix Spiral Fill Sequence",
        "difficulty": "Medium",
        "topic": "2D Matrix Simulation",
        "frequency": "96% in Zoho Coding Round",
        "context": "Zoho Sheet 2D cell layout numbering",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int[][]",
        "description": "Given positive integer `n`, generate an `n x n` matrix filled with elements from `1` to `n^2` in clockwise spiral order.",
        "constraints": [
            "1 <= n <= 20"
        ],
        "hint": "Maintain 4 boundaries: top, bottom, left, right.",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return []",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(n):\n    matrix = [[0] * n for _ in range(n)]\n    top, bottom, left, right = 0, n - 1, 0, n - 1\n    num = 1\n    while top <= bottom and left <= right:\n        for c in range(left, right + 1):\n            matrix[top][c] = num; num += 1\n        top += 1\n        for r in range(top, bottom + 1):\n            matrix[r][right] = num; num += 1\n        right -= 1\n        if top <= bottom:\n            for c in range(right, left - 1, -1):\n                matrix[bottom][c] = num; num += 1\n            bottom -= 1\n        if left <= right:\n            for r in range(bottom, top - 1, -1):\n                matrix[r][left] = num; num += 1\n            left += 1\n    return matrix",
            "javascript": "function solve(n) {\n    const mat = Array.from({ length: n }, () => new Array(n).fill(0));\n    let top = 0, bottom = n - 1, left = 0, right = n - 1, num = 1;\n    while (top <= bottom && left <= right) {\n        for (let c = left; c <= right; c++) mat[top][c] = num++;\n        top++;\n        for (let r = top; r <= bottom; r++) mat[r][right] = num++;\n        right--;\n        if (top <= bottom) {\n            for (let c = right; c >= left; c--) mat[bottom][c] = num++;\n            bottom--;\n        }\n        if (left <= right) {\n            for (let r = bottom; r >= top; r--) mat[r][left] = num++;\n            left++;\n        }\n    }\n    return mat;\n}"
        },
        "testCases": [
            {
                "args": [
                    3
                ],
                "expected": [
                    [
                        1,
                        2,
                        3
                    ],
                    [
                        8,
                        9,
                        4
                    ],
                    [
                        7,
                        6,
                        5
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-4",
        "company": "zoho",
        "category": "fintech",
        "number": 4,
        "title": "Alternate Sorting (Max, Min, Second Max, Second Min)",
        "difficulty": "Easy",
        "topic": "Sorting & Two Pointers",
        "frequency": "97% in Zoho Level 2",
        "context": "Zoho Books invoice balance alternating reconciliation",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given an array of integers, sort it in an alternate fashion: 1st element is max value, 2nd is min value, 3rd is 2nd max, 4th is 2nd min, and so on.",
        "constraints": [
            "1 <= nums.length <= 10^5"
        ],
        "hint": "Sort the array. Use two pointers left=0 and right=n-1, alternating taking from right and left.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    nums.sort()\n    res = []\n    l, r = 0, len(nums) - 1\n    take_max = True\n    while l <= r:\n        if take_max:\n            res.append(nums[r])\n            r -= 1\n        else:\n            res.append(nums[l])\n            l += 1\n        take_max = not take_max\n    return res",
            "javascript": "function solve(nums) {\n    const sorted = [...nums].sort((a, b) => a - b);\n    const res = [];\n    let l = 0, r = sorted.length - 1;\n    let takeMax = true;\n    while (l <= r) {\n        if (takeMax) {\n            res.push(sorted[r--]);\n        } else {\n            res.push(sorted[l++]);\n        }\n        takeMax = !takeMax;\n    }\n    return res;\n}"
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
                    7,
                    1,
                    6,
                    2,
                    5,
                    3,
                    4
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        6,
                        9,
                        4,
                        3,
                        7,
                        8,
                        2
                    ]
                ],
                "expected": [
                    9,
                    1,
                    8,
                    2,
                    7,
                    3,
                    6,
                    4
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-5",
        "company": "zoho",
        "category": "fintech",
        "number": 5,
        "title": "Custom String to Integer Atoi Implementation",
        "difficulty": "Medium",
        "topic": "String Parsing",
        "frequency": "95% in Zoho Classic",
        "context": "Zoho Deluge script parsing runtime",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Implement custom atoi: Discard leading whitespaces. Check optional leading `+` or `-`. Read digits until first non-digit. Clamp result between `-2^31` and `2^31 - 1`. Return 0 if no valid digits.",
        "constraints": [
            "0 <= s.length <= 200"
        ],
        "hint": "Trim whitespace, inspect sign, accumulate digit by digit with 32-bit clamping.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    s = s.lstrip()\n    if not s: return 0\n    sign = 1\n    idx = 0\n    if s[0] == '-': sign = -1; idx = 1\n    elif s[0] == '+': idx = 1\n    num = 0\n    INT_MAX, INT_MIN = 2**31 - 1, -2**31\n    while idx < len(s) and s[idx].isdigit():\n        num = num * 10 + int(s[idx])\n        idx += 1\n    num *= sign\n    if num > INT_MAX: return INT_MAX\n    if num < INT_MIN: return INT_MIN\n    return num",
            "javascript": "function solve(s) {\n    let str = s.trim();\n    if (str.length === 0) return 0;\n    let sign = 1, idx = 0;\n    if (str[0] === '-') { sign = -1; idx = 1; }\n    else if (str[0] === '+') { idx = 1; }\n    let num = 0;\n    const INT_MAX = 2147483647, INT_MIN = -2147483648;\n    while (idx < str.length && str[idx] >= '0' && str[idx] <= '9') {\n        num = num * 10 + parseInt(str[idx], 10);\n        idx++;\n    }\n    num *= sign;\n    if (num > INT_MAX) return INT_MAX;\n    if (num < INT_MIN) return INT_MIN;\n    return num;\n}"
        },
        "testCases": [
            {
                "args": [
                    "   -42"
                ],
                "expected": -42,
                "isHidden": false
            },
            {
                "args": [
                    "4193 with words"
                ],
                "expected": 4193,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-6",
        "company": "zoho",
        "category": "fintech",
        "number": 6,
        "title": "Add Two Arbitrary Large Numbers Given as Strings",
        "difficulty": "Medium",
        "topic": "Big Integer Arithmetic",
        "frequency": "96% in Zoho Coding Round",
        "context": "Zoho Creator arbitrary precision accounting calculations",
        "fnName": "solve",
        "params": [
            {
                "name": "num1",
                "type": "string"
            },
            {
                "name": "num2",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given two non-negative integers `num1` and `num2` represented as strings, return their sum as a string without using any big integer libraries or converting whole inputs to numbers directly.",
        "constraints": [
            "1 <= num1.length, num2.length <= 10^4"
        ],
        "hint": "Digit-by-digit addition from right to left with carry.",
        "starter": {
            "python": "def solve(num1, num2):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(num1, num2) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(num1, num2):\n    res = []\n    i, j, carry = len(num1) - 1, len(num2) - 1, 0\n    while i >= 0 or j >= 0 or carry:\n        d1 = int(num1[i]) if i >= 0 else 0\n        d2 = int(num2[j]) if j >= 0 else 0\n        total = d1 + d2 + carry\n        res.append(str(total % 10))\n        carry = total // 10\n        i -= 1; j -= 1\n    return ''.join(reversed(res))",
            "javascript": "function solve(num1, num2) {\n    const res = [];\n    let i = num1.length - 1, j = num2.length - 1, carry = 0;\n    while (i >= 0 || j >= 0 || carry > 0) {\n        const d1 = i >= 0 ? parseInt(num1[i], 10) : 0;\n        const d2 = j >= 0 ? parseInt(num2[j], 10) : 0;\n        const sum = d1 + d2 + carry;\n        res.push(sum % 10);\n        carry = Math.floor(sum / 10);\n        i--; j--;\n    }\n    return res.reverse().join('');\n}"
        },
        "testCases": [
            {
                "args": [
                    "999999999999999999",
                    "1"
                ],
                "expected": "1000000000000000000",
                "isHidden": false
            },
            {
                "args": [
                    "123",
                    "456"
                ],
                "expected": "579",
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-7",
        "company": "zoho",
        "category": "fintech",
        "number": 7,
        "title": "Print Character Pattern in X-Shape Cross Diagonal",
        "difficulty": "Medium",
        "topic": "Pattern Printing",
        "frequency": "98% in Zoho Round 2 (Most Famous)",
        "context": "Zoho signature matrix visualization question",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "string[]",
        "description": "Given an odd-length string `s` of length `n`, generate an `n x n` character grid where characters of `s` are placed on the main diagonal and anti-diagonal forming an 'X'. All other positions are spaces `' '`. Return array of row strings.",
        "constraints": [
            "s.length is odd",
            "1 <= s.length <= 25"
        ],
        "hint": "For row r and col c: if r == c, char is s[r]; if r + c == n - 1, char is s[r]; else space.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return []",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(s):\n    n = len(s)\n    rows = []\n    for r in range(n):\n        line = [' '] * n\n        line[r] = s[r]\n        line[n - 1 - r] = s[n - 1 - r]\n        rows.append(''.join(line))\n    return rows",
            "javascript": "function solve(s) {\n    const n = s.length;\n    const rows = [];\n    for (let r = 0; r < n; r++) {\n        const line = new Array(n).fill(' ');\n        line[r] = s[r];\n        line[n - 1 - r] = s[n - 1 - r];\n        rows.push(line.join(''));\n    }\n    return rows;\n}"
        },
        "testCases": [
            {
                "args": [
                    "PROGRAM"
                ],
                "expected": [
                    "P     M",
                    " R   A ",
                    "  O R  ",
                    "   G   ",
                    "  O R  ",
                    " R   A ",
                    "P     M"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-8",
        "company": "zoho",
        "category": "fintech",
        "number": 8,
        "title": "Evaluate Math Expression with Operator Precedence",
        "difficulty": "Medium",
        "topic": "Stack & Expression Evaluation",
        "frequency": "94% in Zoho Deluge Engine",
        "context": "Zoho Sheet formula arithmetic evaluator",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a string `s` representing an expression with non-negative integers, `+`, `-`, `*`, `/` and spaces. Evaluate and return result using standard PEMDAS precedence (integer division truncates toward zero). Do not use eval.",
        "constraints": [
            "1 <= s.length <= 10^5"
        ],
        "hint": "Stack: evaluate * and / immediately onto stack top, sum stack at the end for + and -.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    stack = []\n    curr = 0\n    op = '+'\n    s = s.replace(' ', '') + '+'\n    for c in s:\n        if c.isdigit():\n            curr = curr * 10 + int(c)\n        else:\n            if op == '+': stack.append(curr)\n            elif op == '-': stack.append(-curr)\n            elif op == '*': stack.append(stack.pop() * curr)\n            elif op == '/': stack.append(int(stack.pop() / curr))\n            op = c\n            curr = 0\n    return sum(stack)",
            "javascript": "function solve(s) {\n    const stack = [];\n    let curr = 0;\n    let op = '+';\n    const str = s.replace(/\\s+/g, '') + '+';\n    for (let i = 0; i < str.length; i++) {\n        const c = str[i];\n        if (c >= '0' && c <= '9') {\n            curr = curr * 10 + parseInt(c, 10);\n        } else {\n            if (op === '+') stack.push(curr);\n            else if (op === '-') stack.push(-curr);\n            else if (op === '*') stack.push(stack.pop() * curr);\n            else if (op === '/') stack.push(Math.trunc(stack.pop() / curr));\n            op = c;\n            curr = 0;\n        }\n    }\n    return stack.reduce((a, b) => a + b, 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    "3+2*2"
                ],
                "expected": 7,
                "isHidden": false
            },
            {
                "args": [
                    " 3/2 "
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    " 3+5 / 2 "
                ],
                "expected": 5,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-9",
        "company": "zoho",
        "category": "fintech",
        "number": 9,
        "title": "Remove Minimum Parentheses to Make String Valid",
        "difficulty": "Medium",
        "topic": "Stack",
        "frequency": "95% in Zoho Interviews",
        "context": "Zoho Writer grammar validation",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given a string `s` containing `'('`, `')'`, and lower-case letters. Remove minimum number of parentheses so that the remaining string is valid. Return valid string.",
        "constraints": [
            "1 <= s.length <= 10^5"
        ],
        "hint": "Stack stores indices of opening '('. Any extra ')' without match is marked for removal.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(s):\n    stack = []\n    remove_indices = set()\n    for i, c in enumerate(s):\n        if c == '(':\n            stack.append(i)\n        elif c == ')':\n            if stack:\n                stack.pop()\n            else:\n                remove_indices.add(i)\n    remove_indices.update(stack)\n    return ''.join(c for i, c in enumerate(s) if i not in remove_indices)",
            "javascript": "function solve(s) {\n    const stack = [];\n    const removeIndices = new Set();\n    for (let i = 0; i < s.length; i++) {\n        if (s[i] === '(') {\n            stack.push(i);\n        } else if (s[i] === ')') {\n            if (stack.length > 0) stack.pop();\n            else removeIndices.add(i);\n        }\n    }\n    for (const idx of stack) removeIndices.add(idx);\n    let res = '';\n    for (let i = 0; i < s.length; i++) {\n        if (!removeIndices.has(i)) res += s[i];\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    "lee(t(c)o)de)"
                ],
                "expected": "lee(t(c)o)de",
                "isHidden": false
            },
            {
                "args": [
                    "a)b(c)d"
                ],
                "expected": "ab(c)d",
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-10",
        "company": "zoho",
        "category": "fintech",
        "number": 10,
        "title": "Permutation Substring Match in Text (Anagram Substring)",
        "difficulty": "Medium",
        "topic": "Sliding Window Hash",
        "frequency": "93% in Zoho Round 2",
        "context": "Zoho Mail spam token permutation detection",
        "fnName": "solve",
        "params": [
            {
                "name": "s1",
                "type": "string"
            },
            {
                "name": "s2",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.",
        "constraints": [
            "1 <= s1.length, s2.length <= 10^4"
        ],
        "hint": "Sliding window of length len(s1) comparing 26-character frequency arrays.",
        "starter": {
            "python": "def solve(s1, s2):\n    # Write your logic here\n    return False",
            "javascript": "function solve(s1, s2) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(s1, s2):\n    if len(s1) > len(s2): return False\n    from collections import Counter\n    c1 = Counter(s1)\n    k = len(s1)\n    c2 = Counter(s2[:k])\n    if c1 == c2: return True\n    for i in range(k, len(s2)):\n        c2[s2[i]] += 1\n        c2[s2[i - k]] -= 1\n        if c2[s2[i - k]] == 0: del c2[s2[i - k]]\n        if c1 == c2: return True\n    return False",
            "javascript": "function solve(s1, s2) {\n    if (s1.length > s2.length) return false;\n    const k = s1.length;\n    const f1 = new Array(26).fill(0);\n    const f2 = new Array(26).fill(0);\n    for (let i = 0; i < k; i++) {\n        f1[s1.charCodeAt(i) - 97]++;\n        f2[s2.charCodeAt(i) - 97]++;\n    }\n    const match = () => f1.every((v, i) => v === f2[i]);\n    if (match()) return true;\n    for (let i = k; i < s2.length; i++) {\n        f2[s2.charCodeAt(i) - 97]++;\n        f2[s2.charCodeAt(i - k) - 97]--;\n        if (match()) return true;\n    }\n    return false;\n}"
        },
        "testCases": [
            {
                "args": [
                    "ab",
                    "eidbaooo"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "ab",
                    "eidboaoo"
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-11",
        "company": "zoho",
        "category": "fintech",
        "number": 11,
        "title": "Sort Array by Frequency Descending",
        "difficulty": "Medium",
        "topic": "Hash Map Sorting",
        "frequency": "95% in Zoho Screening",
        "context": "Zoho Analytics frequency distribution ordering",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Sort array according to frequency of elements in descending order. If two elements have same frequency, sort them by value ascending.",
        "constraints": [
            "1 <= nums.length <= 10^5"
        ],
        "hint": "Count frequencies with Counter. Sort with key: (-freq[x], x).",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    from collections import Counter\n    freq = Counter(nums)\n    return sorted(nums, key=lambda x: (-freq[x], x))",
            "javascript": "function solve(nums) {\n    const freq = {};\n    for (const x of nums) freq[x] = (freq[x] || 0) + 1;\n    return [...nums].sort((a, b) => freq[b] !== freq[a] ? freq[b] - freq[a] : a - b);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        5,
                        2,
                        8,
                        5,
                        6,
                        8,
                        8
                    ]
                ],
                "expected": [
                    8,
                    8,
                    8,
                    2,
                    2,
                    5,
                    5,
                    6
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-12",
        "company": "zoho",
        "category": "fintech",
        "number": 12,
        "title": "Diagonal Matrix Zig-Zag Traversal",
        "difficulty": "Medium",
        "topic": "Matrix Traversal",
        "frequency": "92% in Zoho Advanced",
        "context": "Zoho Sheet diagonal rendering",
        "fnName": "solve",
        "params": [
            {
                "name": "mat",
                "type": "int[][]"
            }
        ],
        "returnType": "int[]",
        "description": "Given `m x n` matrix `mat`, return an array of all elements of the matrix in a diagonal order alternating up-right and down-left.",
        "constraints": [
            "1 <= mat.length, mat[0].length <= 200"
        ],
        "hint": "Elements on same diagonal have same (r + c). Alternate reversing diagonal lists.",
        "starter": {
            "python": "def solve(mat):\n    # Write your logic here\n    return []",
            "javascript": "function solve(mat) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(mat):\n    R, C = len(mat), len(mat[0])\n    from collections import defaultdict\n    diags = defaultdict(list)\n    for r in range(R):\n        for c in range(C):\n            diags[r + c].append(mat[r][c])\n    res = []\n    for d in range(R + C - 1):\n        if d % 2 == 0:\n            res.extend(reversed(diags[d]))\n        else:\n            res.extend(diags[d])\n    return res",
            "javascript": "function solve(mat) {\n    const R = mat.length, C = mat[0].length;\n    const diags = Array.from({ length: R + C - 1 }, () => []);\n    for (let r = 0; r < R; r++) {\n        for (let c = 0; c < C; c++) {\n            diags[r + c].push(mat[r][c]);\n        }\n    }\n    const res = [];\n    for (let d = 0; d < diags.length; d++) {\n        if (d % 2 === 0) res.push(...diags[d].reverse());\n        else res.push(...diags[d]);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            2,
                            3
                        ],
                        [
                            4,
                            5,
                            6
                        ],
                        [
                            7,
                            8,
                            9
                        ]
                    ]
                ],
                "expected": [
                    1,
                    2,
                    4,
                    7,
                    5,
                    3,
                    6,
                    8,
                    9
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-13",
        "company": "zoho",
        "category": "fintech",
        "number": 13,
        "title": "Look-and-Say Sequence (Count and Say)",
        "difficulty": "Medium",
        "topic": "String Simulation",
        "frequency": "94% in Zoho Round 2",
        "context": "Run-length sequence generation",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "string",
        "description": "Generate the `n`-th term of the count-and-say sequence. Base case `n = 1` is `'1'`. For `n > 1`, describe the previous term by grouping consecutive identical digits (e.g., '11' -> '21').",
        "constraints": [
            "1 <= n <= 30"
        ],
        "hint": "Loop n - 1 times, compressing previous string with run-length count + char.",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(n):\n    curr = \"1\"\n    for _ in range(n - 1):\n        nxt = []\n        i = 0\n        while i < len(curr):\n            j = i\n            while j < len(curr) and curr[j] == curr[i]: j += 1\n            nxt.append(str(j - i) + curr[i])\n            i = j\n        curr = \"\".join(nxt)\n    return curr",
            "javascript": "function solve(n) {\n    let curr = '1';\n    for (let step = 1; step < n; step++) {\n        let nxt = '', i = 0;\n        while (i < curr.length) {\n            let j = i;\n            while (j < curr.length && curr[j] === curr[i]) j++;\n            nxt += String(j - i) + curr[i];\n            i = j;\n        }\n        curr = nxt;\n    }\n    return curr;\n}"
        },
        "testCases": [
            {
                "args": [
                    4
                ],
                "expected": "1211",
                "isHidden": false
            },
            {
                "args": [
                    1
                ],
                "expected": "1",
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-14",
        "company": "zoho",
        "category": "fintech",
        "number": 14,
        "title": "Next Greater Element on Right",
        "difficulty": "Medium",
        "topic": "Monotonic Stack",
        "frequency": "95% in Zoho Level 2",
        "context": "Lookup optimization in streaming table columns",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "For each element in `nums`, find the first greater element to its right. If no greater element exists, output `-1`.",
        "constraints": [
            "1 <= nums.length <= 10^5"
        ],
        "hint": "Monotonic decreasing stack traversed from right to left.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    res = [-1] * len(nums)\n    stack = []\n    for i in range(len(nums) - 1, -1, -1):\n        while stack and stack[-1] <= nums[i]:\n            stack.pop()\n        if stack: res[i] = stack[-1]\n        stack.append(nums[i])\n    return res",
            "javascript": "function solve(nums) {\n    const res = new Array(nums.length).fill(-1);\n    const stack = [];\n    for (let i = nums.length - 1; i >= 0; i--) {\n        while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {\n            stack.pop();\n        }\n        if (stack.length > 0) res[i] = stack[stack.length - 1];\n        stack.push(nums[i]);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        4,
                        5,
                        2,
                        25
                    ]
                ],
                "expected": [
                    5,
                    25,
                    25,
                    -1
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        13,
                        7,
                        6,
                        12
                    ]
                ],
                "expected": [
                    -1,
                    12,
                    12,
                    -1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-15",
        "company": "zoho",
        "category": "fintech",
        "number": 15,
        "title": "Largest Sum Contiguous Subarray (Kadane)",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "frequency": "97% in Zoho Fundamentals",
        "context": "Net gain interval discovery",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `nums`, find the contiguous subarray with the largest sum and return its sum.",
        "constraints": [
            "1 <= nums.length <= 10^5"
        ],
        "hint": "Kadane's algorithm: curr = max(x, curr + x), ans = max(ans, curr).",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    ans = curr = nums[0]\n    for x in nums[1:]:\n        curr = max(x, curr + x)\n        ans = max(ans, curr)\n    return ans",
            "javascript": "function solve(nums) {\n    let ans = nums[0], curr = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        ans = Math.max(ans, curr);\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        -2,
                        1,
                        -3,
                        4,
                        -1,
                        2,
                        1,
                        -5,
                        4
                    ]
                ],
                "expected": 6,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-16",
        "company": "zoho",
        "category": "fintech",
        "number": 16,
        "title": "Multiply Two Strings Arbitrary Precision",
        "difficulty": "Medium",
        "topic": "Math & String Manipulation",
        "frequency": "93% in Zoho Advanced",
        "context": "High precision integer product without bignum libraries",
        "fnName": "solve",
        "params": [
            {
                "name": "num1",
                "type": "string"
            },
            {
                "name": "num2",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given two non-negative integers represented as strings `num1` and `num2`, return their product as string without directly converting inputs to numbers.",
        "constraints": [
            "1 <= num1.length, num2.length <= 200"
        ],
        "hint": "Result has length at most len1 + len2. Indices i + j and i + j + 1 accumulate product.",
        "starter": {
            "python": "def solve(num1, num2):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(num1, num2) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(num1, num2):\n    if num1 == '0' or num2 == '0': return '0'\n    m, n = len(num1), len(num2)\n    res = [0] * (m + n)\n    for i in range(m - 1, -1, -1):\n        for j in range(n - 1, -1, -1):\n            mul = int(num1[i]) * int(num2[j])\n            p1, p2 = i + j, i + j + 1\n            total = mul + res[p2]\n            res[p2] = total % 10\n            res[p1] += total // 10\n    s = ''.join(str(x) for x in res).lstrip('0')\n    return s if s else '0'",
            "javascript": "function solve(num1, num2) {\n    if (num1 === '0' || num2 === '0') return '0';\n    const m = num1.length, n = num2.length;\n    const res = new Array(m + n).fill(0);\n    for (let i = m - 1; i >= 0; i--) {\n        for (let j = n - 1; j >= 0; j--) {\n            const mul = parseInt(num1[i], 10) * parseInt(num2[j], 10);\n            const p1 = i + j, p2 = i + j + 1;\n            const total = mul + res[p2];\n            res[p2] = total % 10;\n            res[p1] += Math.floor(total / 10);\n        }\n    }\n    while (res.length > 1 && res[0] === 0) res.shift();\n    return res.join('');\n}"
        },
        "testCases": [
            {
                "args": [
                    "123",
                    "456"
                ],
                "expected": "56088",
                "isHidden": false
            },
            {
                "args": [
                    "0",
                    "52"
                ],
                "expected": "0",
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-17",
        "company": "zoho",
        "category": "fintech",
        "number": 17,
        "title": "Matrix 90-Degree Clockwise In-Place Rotation",
        "difficulty": "Medium",
        "topic": "Matrix In-Place",
        "frequency": "95% in Zoho Core",
        "context": "Zoho Canvas image matrix layer rotation",
        "fnName": "solve",
        "params": [
            {
                "name": "matrix",
                "type": "int[][]"
            }
        ],
        "returnType": "int[][]",
        "description": "Given `n x n` 2D matrix, rotate it 90 degrees clockwise in-place and return the rotated matrix.",
        "constraints": [
            "1 <= n <= 50"
        ],
        "hint": "Transpose matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row.",
        "starter": {
            "python": "def solve(matrix):\n    # Write your logic here\n    return []",
            "javascript": "function solve(matrix) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(matrix):\n    n = len(matrix)\n    for i in range(n):\n        for j in range(i + 1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    for i in range(n):\n        matrix[i].reverse()\n    return matrix",
            "javascript": "function solve(matrix) {\n    const n = matrix.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            const tmp = matrix[i][j];\n            matrix[i][j] = matrix[j][i];\n            matrix[j][i] = tmp;\n        }\n    }\n    for (let i = 0; i < n; i++) matrix[i].reverse();\n    return matrix;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            2,
                            3
                        ],
                        [
                            4,
                            5,
                            6
                        ],
                        [
                            7,
                            8,
                            9
                        ]
                    ]
                ],
                "expected": [
                    [
                        7,
                        4,
                        1
                    ],
                    [
                        8,
                        5,
                        2
                    ],
                    [
                        9,
                        6,
                        3
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-18",
        "company": "zoho",
        "category": "fintech",
        "number": 18,
        "title": "Check String Rotation Without Built-in Concat Search",
        "difficulty": "Easy",
        "topic": "String Simulation",
        "frequency": "94% in Zoho Level 1",
        "context": "Rotational shift verification",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "goal",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Given two strings `s` and `goal`, return `true` if and only if `s` can become `goal` after some number of cyclic shifts.",
        "constraints": [
            "1 <= s.length, goal.length <= 100"
        ],
        "hint": "Lengths must match. Goal must be a substring of s + s.",
        "starter": {
            "python": "def solve(s, goal):\n    # Write your logic here\n    return False",
            "javascript": "function solve(s, goal) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(s, goal):\n    return len(s) == len(goal) and goal in (s + s)",
            "javascript": "function solve(s, goal) {\n    return s.length === goal.length && (s + s).includes(goal);\n}"
        },
        "testCases": [
            {
                "args": [
                    "abcde",
                    "cdeab"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "abcde",
                    "abced"
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-19",
        "company": "zoho",
        "category": "fintech",
        "number": 19,
        "title": "Roman Numerals to Integer Converter",
        "difficulty": "Easy",
        "topic": "String & Hash Map",
        "frequency": "96% in Zoho Level 1",
        "context": "Parsing historical roman chapter identifiers in Zoho Writer",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a valid Roman numeral string s (I=1, V=5, X=10, L=50, C=100, D=500, M=1000), convert it to its decimal integer value. Subtract smaller value when preceding larger value (e.g. IV = 4).",
        "constraints": [
            "1 <= s.length <= 15",
            "Valid Roman numeral in range 1 to 3999"
        ],
        "hint": "If current roman value is less than next roman value, subtract current value; otherwise add it.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    vals = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}\n    total = 0\n    for i in range(len(s)):\n        if i + 1 < len(s) and vals[s[i]] < vals[s[i + 1]]:\n            total -= vals[s[i]]\n        else:\n            total += vals[s[i]]\n    return total",
            "javascript": "function solve(s) {\n    const vals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };\n    let total = 0;\n    for (let i = 0; i < s.length; i++) {\n        if (i + 1 < s.length && vals[s[i]] < vals[s[i + 1]]) {\n            total -= vals[s[i]];\n        } else {\n            total += vals[s[i]];\n        }\n    }\n    return total;\n}"
        },
        "testCases": [
            {
                "args": [
                    "III"
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    "LVIII"
                ],
                "expected": 58,
                "isHidden": false
            },
            {
                "args": [
                    "MCMXCIV"
                ],
                "expected": 1994,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zoho-20",
        "company": "zoho",
        "category": "fintech",
        "number": 20,
        "title": "Number to Words Indian Currency Formatter",
        "difficulty": "Medium",
        "topic": "String Formatting & Recursion",
        "frequency": "95% in Zoho Invoicing",
        "context": "Printing amount in words on Zoho Invoice GST bills",
        "fnName": "solve",
        "params": [
            {
                "name": "num",
                "type": "int"
            }
        ],
        "returnType": "string",
        "description": "Convert a non-negative integer `num` (0 <= num <= 999999) into English words (e.g. 125 -> 'One Hundred Twenty Five'). If 0, return 'Zero'.",
        "constraints": [
            "0 <= num <= 999999"
        ],
        "hint": "Handle below 20, below 100, below 1000, and thousands recursively.",
        "starter": {
            "python": "def solve(num):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(num) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(num):\n    if num == 0: return 'Zero'\n    ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']\n    tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']\n    def helper(n):\n        if n == 0: return ''\n        elif n < 20: return ones[n] + ' '\n        elif n < 100: return tens[n // 10] + ' ' + helper(n % 10)\n        elif n < 1000: return ones[n // 100] + ' Hundred ' + helper(n % 100)\n        else: return helper(n // 1000).strip() + ' Thousand ' + helper(n % 1000)\n    return helper(num).strip()",
            "javascript": "function solve(num) {\n    if (num === 0) return 'Zero';\n    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];\n    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];\n    const helper = (n) => {\n        if (n === 0) return '';\n        if (n < 20) return ones[n] + ' ';\n        if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);\n        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + helper(n % 100);\n        return helper(Math.floor(n / 1000)).trim() + ' Thousand ' + helper(n % 1000);\n    };\n    return helper(num).trim();\n}"
        },
        "testCases": [
            {
                "args": [
                    123
                ],
                "expected": "One Hundred Twenty Three",
                "isHidden": false
            },
            {
                "args": [
                    12345
                ],
                "expected": "Twelve Thousand Three Hundred Forty Five",
                "isHidden": false
            },
            {
                "args": [
                    0
                ],
                "expected": "Zero",
                "isHidden": false
            }
        ]
    }
];
