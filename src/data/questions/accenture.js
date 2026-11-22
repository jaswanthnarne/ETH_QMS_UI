export const ACCENTURE_QUESTIONS = [
    {
        "id": "acc-1",
        "company": "accenture",
        "category": "service",
        "number": 1,
        "title": "Binary String Operations (AND, OR, XOR)",
        "difficulty": "Easy",
        "topic": "Bitwise & Strings",
        "frequency": "98% in Accenture ASE",
        "context": "Accenture Technical Assessment Question 1 benchmark",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "A string consists of binary digits '0' and '1' separated by characters 'A' (AND), 'B' (OR), and 'C' (XOR). Evaluate the string left to right sequentially and return the final integer result (0 or 1). If string is empty, return -1.",
        "constraints": [
            "1 <= s.length <= 10^4",
            "Characters at even indices are '0' or '1'"
        ],
        "hint": "Initialize res = int(s[0]). Step by 2: op = s[i], next_val = int(s[i+1]). Apply operation.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    if not s: return -1\n    ans = int(s[0])\n    i = 1\n    while i < len(s):\n        op = s[i]\n        val = int(s[i + 1])\n        if op == 'A': ans &= val\n        elif op == 'B': ans |= val\n        elif op == 'C': ans ^= val\n        i += 2\n    return ans",
            "javascript": "function solve(s) {\n    if (!s) return -1;\n    let ans = Number(s[0]);\n    for (let i = 1; i < s.length; i += 2) {\n        const op = s[i], val = Number(s[i + 1]);\n        if (op === 'A') ans &= val;\n        else if (op === 'B') ans |= val;\n        else if (op === 'C') ans ^= val;\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    "1C0C1C1A0B1"
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    "0C1A1B1C1C1B0A0"
                ],
                "expected": 0,
                "isHidden": false
            },
            {
                "args": [
                    "1A1A1"
                ],
                "expected": 1,
                "isHidden": true
            }
        ]
    },
    {
        "id": "acc-2",
        "company": "accenture",
        "category": "service",
        "number": 2,
        "title": "Corporate Password Validator",
        "difficulty": "Easy",
        "topic": "String Parsing",
        "frequency": "95% in Accenture ASE",
        "context": "Authentication security in Accenture onboarding test",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Check if string `s` is a valid corporate password according to rules: 1) At least 4 characters long. 2) At least 1 numeric digit ('0'-'9'). 3) At least 1 uppercase letter ('A'-'Z'). 4) Must not contain space (' ') or slash ('/'). 5) Starting character must NOT be a digit. Return 1 if valid, 0 otherwise.",
        "constraints": [
            "1 <= s.length <= 1000"
        ],
        "hint": "Check all conditions sequentially. If s[0] is digit, immediately return 0.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    if len(s) < 4 or s[0].isdigit(): return 0\n    has_digit = False\n    has_upper = False\n    for c in s:\n        if c == ' ' or c == '/': return 0\n        if c.isdigit(): has_digit = True\n        if c.isupper(): has_upper = True\n    return 1 if (has_digit and has_upper) else 0",
            "javascript": "function solve(s) {\n    if (s.length < 4 || (s[0] >= '0' && s[0] <= '9')) return 0;\n    let hasDigit = false, hasUpper = false;\n    for (const c of s) {\n        if (c === ' ' || c === '/') return 0;\n        if (c >= '0' && c <= '9') hasDigit = true;\n        if (c >= 'A' && c <= 'Z') hasUpper = true;\n    }\n    return (hasDigit && hasUpper) ? 1 : 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    "aA1_67"
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    "a987 abC012"
                ],
                "expected": 0,
                "isHidden": false
            },
            {
                "args": [
                    "1abcA"
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "acc-3",
        "company": "accenture",
        "category": "service",
        "number": 3,
        "title": "Sum of Differences in Range (Divisible vs Non-Divisible)",
        "difficulty": "Easy",
        "topic": "Math & Loops",
        "frequency": "90% in Accenture ASE",
        "context": "Accenture numeric filtering standard",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            },
            {
                "name": "m",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given positive integers `n` and `m`, calculate: `sum1` = sum of all integers in range `[1, m]` that are NOT divisible by `n`. `sum2` = sum of all integers in range `[1, m]` that ARE divisible by `n`. Return `sum1 - sum2`.",
        "constraints": [
            "1 <= n <= 1000",
            "1 <= m <= 10^5"
        ],
        "hint": "Sum all x in 1..m: if x % n == 0 add to sum2 else add to sum1. Return sum1 - sum2.",
        "starter": {
            "python": "def solve(n, m):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n, m) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n, m):\n    sum1 = sum(x for x in range(1, m + 1) if x % n != 0)\n    sum2 = sum(x for x in range(1, m + 1) if x % n == 0)\n    return sum1 - sum2",
            "javascript": "function solve(n, m) {\n    let sum1 = 0, sum2 = 0;\n    for (let x = 1; x <= m; x++) {\n        if (x % n === 0) sum2 += x;\n        else sum1 += x;\n    }\n    return sum1 - sum2;\n}"
        },
        "testCases": [
            {
                "args": [
                    4,
                    20
                ],
                "expected": 90,
                "isHidden": false
            },
            {
                "args": [
                    3,
                    10
                ],
                "expected": 19,
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-4",
        "company": "accenture",
        "category": "service",
        "number": 4,
        "title": "Product of Two Smallest Elements vs Sum",
        "difficulty": "Easy",
        "topic": "Arrays & Sorting",
        "frequency": "92% in Accenture ASE",
        "context": "Accenture array threshold evaluation",
        "fnName": "solve",
        "params": [
            {
                "name": "sumVal",
                "type": "int"
            },
            {
                "name": "arr",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given integer `sumVal` and array `arr`. If `arr.length < 2`, return -1. Find the two smallest elements in `arr`. If their sum is strictly less than `sumVal`, return their product. Otherwise return 0.",
        "constraints": [
            "0 <= arr.length <= 10^5",
            "0 <= sumVal <= 10^5"
        ],
        "hint": "Sort the array. Check if arr[0] + arr[1] < sumVal. If yes, return arr[0] * arr[1].",
        "starter": {
            "python": "def solve(sumVal, arr):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(sumVal, arr) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(sumVal, arr):\n    if len(arr) < 2: return -1\n    s = sorted(arr)\n    if s[0] + s[1] < sumVal:\n        return s[0] * s[1]\n    return 0",
            "javascript": "function solve(sumVal, arr) {\n    if (arr.length < 2) return -1;\n    const s = [...arr].sort((a, b) => a - b);\n    if (s[0] + s[1] < sumVal) return s[0] * s[1];\n    return 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    9,
                    [
                        5,
                        2,
                        4,
                        3,
                        9,
                        7,
                        1
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    4,
                    [
                        9,
                        8,
                        3,
                        -1
                    ]
                ],
                "expected": -3,
                "isHidden": false
            },
            {
                "args": [
                    5,
                    [
                        10
                    ]
                ],
                "expected": -1,
                "isHidden": true
            }
        ]
    },
    {
        "id": "acc-5",
        "company": "accenture",
        "category": "service",
        "number": 5,
        "title": "Move All Zeroes to Array End",
        "difficulty": "Easy",
        "topic": "Two Pointers",
        "frequency": "96% in Accenture FSE",
        "context": "In-place memory consolidation in Accenture",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given integer array `nums`, move all 0's to the end of it while maintaining the relative order of the non-zero elements in-place.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "-2^31 <= nums[i] <= 2^31 - 1"
        ],
        "hint": "Track writeIndex. For each non-zero element, swap or place at writeIndex.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    arr = list(nums)\n    pos = 0\n    for i in range(len(arr)):\n        if arr[i] != 0:\n            arr[pos], arr[i] = arr[i], arr[pos]\n            pos += 1\n    return arr",
            "javascript": "function solve(nums) {\n    const arr = [...nums];\n    let pos = 0;\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i] !== 0) {\n            const tmp = arr[pos];\n            arr[pos] = arr[i];\n            arr[i] = tmp;\n            pos++;\n        }\n    }\n    return arr;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        0,
                        1,
                        0,
                        3,
                        12
                    ]
                ],
                "expected": [
                    1,
                    3,
                    12,
                    0,
                    0
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        0
                    ]
                ],
                "expected": [
                    0
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-6",
        "company": "accenture",
        "category": "service",
        "number": 6,
        "title": "Alternate Character Swap in String",
        "difficulty": "Easy",
        "topic": "Strings",
        "frequency": "88% in Accenture ASE",
        "context": "Text mutation encoding in Accenture ASE",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "ch1",
                "type": "string"
            },
            {
                "name": "ch2",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given a string `s` and two characters `ch1` and `ch2`. Replace every occurrence of `ch1` with `ch2` and every occurrence of `ch2` with `ch1`. All other characters remain unchanged.",
        "constraints": [
            "1 <= s.length <= 10^5"
        ],
        "hint": "Iterate through string: if c == ch1 return ch2, if c == ch2 return ch1, else return c.",
        "starter": {
            "python": "def solve(s, ch1, ch2):\n    # Write your logic here\n    return ''",
            "javascript": "function solve(s, ch1, ch2) {\n    // Write your logic here\n    return '';\n}"
        },
        "solution": {
            "python": "def solve(s, ch1, ch2):\n    return ''.join(ch2 if c == ch1 else ch1 if c == ch2 else c for c in s)",
            "javascript": "function solve(s, ch1, ch2) {\n    let res = '';\n    for (const c of s) {\n        if (c === ch1) res += ch2;\n        else if (c === ch2) res += ch1;\n        else res += c;\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    "apples",
                    "a",
                    "p"
                ],
                "expected": "paales",
                "isHidden": false
            },
            {
                "args": [
                    "banana",
                    "a",
                    "b"
                ],
                "expected": "abnbnb",
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-7",
        "company": "accenture",
        "category": "service",
        "number": 7,
        "title": "Elements with Absolute Difference Within Diff",
        "difficulty": "Easy",
        "topic": "Arrays & Filtering",
        "frequency": "90% in Accenture ASE",
        "context": "Accenture tolerance bounds question",
        "fnName": "solve",
        "params": [
            {
                "name": "arr",
                "type": "int[]"
            },
            {
                "name": "num",
                "type": "int"
            },
            {
                "name": "diff",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `arr`, and integers `num` and `diff`. Count the number of elements `x` in `arr` such that `abs(x - num) <= diff`. If count is 0, return -1.",
        "constraints": [
            "1 <= arr.length <= 10^5",
            "diff >= 0"
        ],
        "hint": "Loop over array. If abs(x - num) <= diff increment counter. Return count > 0 ? count : -1.",
        "starter": {
            "python": "def solve(arr, num, diff):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(arr, num, diff) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(arr, num, diff):\n    c = sum(1 for x in arr if abs(x - num) <= diff)\n    return c if c > 0 else -1",
            "javascript": "function solve(arr, num, diff) {\n    let count = 0;\n    for (const x of arr) if (Math.abs(x - num) <= diff) count++;\n    return count > 0 ? count : -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        12,
                        3,
                        14,
                        56,
                        77,
                        13
                    ],
                    13,
                    2
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        100,
                        200,
                        300
                    ],
                    10,
                    5
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-8",
        "company": "accenture",
        "category": "service",
        "number": 8,
        "title": "Autobiographical Number Check",
        "difficulty": "Medium",
        "topic": "String Math",
        "frequency": "85% in Accenture FSE",
        "context": "Self-referential digit logic in Accenture FSE",
        "fnName": "solve",
        "params": [
            {
                "name": "nStr",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "An autobiographical number has digit at index `i` equal to the count of digit `i` in the entire string. If `nStr` is autobiographical, return the number of distinct digits present in it. If not autobiographical, return 0.",
        "constraints": [
            "1 <= nStr.length <= 10"
        ],
        "hint": "Count frequency of each digit. Verify count(i) == int(nStr[i]) for all indices 0..len-1.",
        "starter": {
            "python": "def solve(nStr):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nStr) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nStr):\n    from collections import Counter\n    counts = Counter(nStr)\n    for i in range(len(nStr)):\n        expected = int(nStr[i])\n        actual = counts.get(str(i), 0)\n        if expected != actual:\n            return 0\n    return len(set(nStr))",
            "javascript": "function solve(nStr) {\n    const counts = {};\n    for (const ch of nStr) counts[ch] = (counts[ch] || 0) + 1;\n    for (let i = 0; i < nStr.length; i++) {\n        const expected = Number(nStr[i]);\n        const actual = counts[String(i)] || 0;\n        if (expected !== actual) return 0;\n    }\n    return new Set(nStr).size;\n}"
        },
        "testCases": [
            {
                "args": [
                    "1210"
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    "2020"
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    "1234"
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "acc-9",
        "company": "accenture",
        "category": "service",
        "number": 9,
        "title": "Maximum Power of Two Divisor in Range",
        "difficulty": "Easy",
        "topic": "Bit Manipulation",
        "frequency": "87% in Accenture ASE",
        "context": "Binary exponent search in Accenture ASE",
        "fnName": "solve",
        "params": [
            {
                "name": "a",
                "type": "int"
            },
            {
                "name": "b",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given range `[a, b]`, find the integer `x` in `[a, b]` that has the maximum exponent of 2 dividing it (i.e. highest power of 2 factor). If tie, return the smallest `x`.",
        "constraints": [
            "1 <= a <= b <= 10^5"
        ],
        "hint": "For each x, count trailing zeroes in binary representation (x & -x).",
        "starter": {
            "python": "def solve(a, b):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(a, b) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(a, b):\n    best_val = a\n    max_exp = -1\n    for x in range(a, b + 1):\n        exp = 0\n        temp = x\n        while temp % 2 == 0 and temp > 0:\n            exp += 1\n            temp //= 2\n        if exp > max_exp:\n            max_exp = exp\n            best_val = x\n    return best_val",
            "javascript": "function solve(a, b) {\n    let bestVal = a, maxExp = -1;\n    for (let x = a; x <= b; x++) {\n        let exp = 0, temp = x;\n        while (temp % 2 === 0 && temp > 0) {\n            exp++;\n            temp = Math.floor(temp / 2);\n        }\n        if (exp > maxExp) {\n            maxExp = exp;\n            bestVal = x;\n        }\n    }\n    return bestVal;\n}"
        },
        "testCases": [
            {
                "args": [
                    7,
                    12
                ],
                "expected": 8,
                "isHidden": false
            },
            {
                "args": [
                    10,
                    14
                ],
                "expected": 12,
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-10",
        "company": "accenture",
        "category": "service",
        "number": 10,
        "title": "Array Leader Elements",
        "difficulty": "Easy",
        "topic": "Arrays",
        "frequency": "93% in Accenture ASE",
        "context": "Accenture right-max traversal question",
        "fnName": "solve",
        "params": [
            {
                "name": "arr",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "An element is a leader if it is strictly greater than all elements to its right. The rightmost element is always a leader. Return all leaders in the array from left to right.",
        "constraints": [
            "1 <= arr.length <= 10^5",
            "0 <= arr[i] <= 10^9"
        ],
        "hint": "Traverse from right to left tracking max_so_far. Collect leaders and reverse list at end.",
        "starter": {
            "python": "def solve(arr):\n    # Write your logic here\n    return []",
            "javascript": "function solve(arr) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(arr):\n    leaders = []\n    max_right = -1\n    for x in reversed(arr):\n        if x > max_right:\n            leaders.append(x)\n            max_right = x\n    return leaders[::-1]",
            "javascript": "function solve(arr) {\n    const leaders = [];\n    let maxRight = -Infinity;\n    for (let i = arr.length - 1; i >= 0; i--) {\n        if (arr[i] > maxRight) {\n            leaders.push(arr[i]);\n            maxRight = arr[i];\n        }\n    }\n    return leaders.reverse();\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        16,
                        17,
                        4,
                        3,
                        5,
                        2
                    ]
                ],
                "expected": [
                    17,
                    5,
                    2
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        4,
                        0
                    ]
                ],
                "expected": [
                    4,
                    0
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-11",
        "company": "accenture",
        "category": "service",
        "number": 11,
        "title": "Sum of Second Largest in Even and Odd Indexed Positions",
        "difficulty": "Easy",
        "topic": "Arrays & Sorting",
        "frequency": "91% in Accenture ASE",
        "context": "Accenture indexed array manipulation",
        "fnName": "solve",
        "params": [
            {
                "name": "arr",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `arr`. If length <= 3, return 0. Extract elements at even indices and odd indices separately. Find the second largest element in the even array and second largest in the odd array. Return their sum.",
        "constraints": [
            "1 <= arr.length <= 10^5"
        ],
        "hint": "Split into evens (0, 2, 4...) and odds (1, 3, 5...). Sort descending and pick index 1 from both.",
        "starter": {
            "python": "def solve(arr):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(arr) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(arr):\n    if len(arr) <= 3: return 0\n    evens = sorted([arr[i] for i in range(0, len(arr), 2)], reverse=True)\n    odds = sorted([arr[i] for i in range(1, len(arr), 2)], reverse=True)\n    if len(evens) < 2 or len(odds) < 2: return 0\n    return evens[1] + odds[1]",
            "javascript": "function solve(arr) {\n    if (arr.length <= 3) return 0;\n    const evens = [], odds = [];\n    for (let i = 0; i < arr.length; i++) {\n        if (i % 2 === 0) evens.push(arr[i]);\n        else odds.push(arr[i]);\n    }\n    evens.sort((a, b) => b - a);\n    odds.sort((a, b) => b - a);\n    if (evens.length < 2 || odds.length < 2) return 0;\n    return evens[1] + odds[1];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        2,
                        1,
                        7,
                        5,
                        4
                    ]
                ],
                "expected": 7,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        8,
                        0,
                        2,
                        3,
                        5,
                        6
                    ]
                ],
                "expected": 8,
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-12",
        "company": "accenture",
        "category": "service",
        "number": 12,
        "title": "Reverse Words in a Given Sentence",
        "difficulty": "Easy",
        "topic": "Strings",
        "frequency": "94% in Accenture ASE",
        "context": "Sentence formatting in Accenture ASE",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given a string `s`, reverse the order of words. Words are separated by one or more spaces. Return a single space-separated string with no extra leading or trailing spaces.",
        "constraints": [
            "1 <= s.length <= 10^4"
        ],
        "hint": "Split by whitespace, reverse word list, join with single space.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return ''",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return '';\n}"
        },
        "solution": {
            "python": "def solve(s):\n    return ' '.join(s.strip().split()[::-1])",
            "javascript": "function solve(s) {\n    return s.trim().split(/\\s+/).reverse().join(' ');\n}"
        },
        "testCases": [
            {
                "args": [
                    "the sky is blue"
                ],
                "expected": "blue is sky the",
                "isHidden": false
            },
            {
                "args": [
                    "  hello world  "
                ],
                "expected": "world hello",
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-13",
        "company": "accenture",
        "category": "service",
        "number": 13,
        "title": "Count Array Inversions",
        "difficulty": "Medium",
        "topic": "Divide and Conquer",
        "frequency": "88% in Accenture FSE",
        "context": "Accenture FSE sorting measure",
        "fnName": "solve",
        "params": [
            {
                "name": "arr",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an array `arr`, return the number of inversions. Two elements `arr[i]` and `arr[j]` form an inversion if `arr[i] > arr[j]` and `i < j`.",
        "constraints": [
            "1 <= arr.length <= 5000",
            "0 <= arr[i] <= 10^6"
        ],
        "hint": "Can solve via modified Merge Sort or Fenwick tree in O(n log n).",
        "starter": {
            "python": "def solve(arr):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(arr) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(arr):\n    ans = 0\n    for i in range(len(arr)):\n        for j in range(i + 1, len(arr)):\n            if arr[i] > arr[j]: ans += 1\n    return ans",
            "javascript": "function solve(arr) {\n    let ans = 0;\n    for (let i = 0; i < arr.length; i++) {\n        for (let j = i + 1; j < arr.length; j++) {\n            if (arr[i] > arr[j]) ans++;\n        }\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        8,
                        4,
                        2,
                        1
                    ]
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        4,
                        5
                    ]
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-14",
        "company": "accenture",
        "category": "service",
        "number": 14,
        "title": "Merge Two Sorted Arrays Combined",
        "difficulty": "Easy",
        "topic": "Two Pointers",
        "frequency": "92% in Accenture ASE",
        "context": "Accenture core data merging",
        "fnName": "solve",
        "params": [
            {
                "name": "nums1",
                "type": "int[]"
            },
            {
                "name": "nums2",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given two sorted integer arrays `nums1` and `nums2`, merge them into a single sorted array and return it.",
        "constraints": [
            "0 <= nums1.length, nums2.length <= 10^4"
        ],
        "hint": "Use two pointers i and j. Append the smaller element at each step.",
        "starter": {
            "python": "def solve(nums1, nums2):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums1, nums2) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums1, nums2):\n    res = []\n    i = j = 0\n    while i < len(nums1) and j < len(nums2):\n        if nums1[i] <= nums2[j]:\n            res.append(nums1[i]); i += 1\n        else:\n            res.append(nums2[j]); j += 1\n    res.extend(nums1[i:])\n    res.extend(nums2[j:])\n    return res",
            "javascript": "function solve(nums1, nums2) {\n    const res = [];\n    let i = 0, j = 0;\n    while (i < nums1.length && j < nums2.length) {\n        if (nums1[i] <= nums2[j]) res.push(nums1[i++]);\n        else res.push(nums2[j++]);\n    }\n    while (i < nums1.length) res.push(nums1[i++]);\n    while (j < nums2.length) res.push(nums2[j++]);\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        3,
                        5
                    ],
                    [
                        2,
                        4,
                        6
                    ]
                ],
                "expected": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        1
                    ],
                    []
                ],
                "expected": [
                    1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-15",
        "company": "accenture",
        "category": "service",
        "number": 15,
        "title": "Single Non-Repeating Number in Pairs",
        "difficulty": "Easy",
        "topic": "Bitwise XOR",
        "frequency": "95% in Accenture ASE",
        "context": "Accenture XOR logic test",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given non-empty array of integers `nums`, every element appears twice except for one. Find that single unique element using linear runtime and O(1) space.",
        "constraints": [
            "1 <= nums.length <= 3 * 10^4"
        ],
        "hint": "a ^ a = 0 and a ^ 0 = a. XOR all elements together.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    ans = 0\n    for x in nums: ans ^= x\n    return ans",
            "javascript": "function solve(nums) {\n    return nums.reduce((acc, x) => acc ^ x, 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        2,
                        1
                    ]
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    [
                        4,
                        1,
                        2,
                        1,
                        2
                    ]
                ],
                "expected": 4,
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-16",
        "company": "accenture",
        "category": "service",
        "number": 16,
        "title": "Valid String Anagram Match",
        "difficulty": "Easy",
        "topic": "Hashing",
        "frequency": "96% in Accenture ASE",
        "context": "Accenture string frequency assessment",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "t",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
        "constraints": [
            "1 <= s.length, t.length <= 5 * 10^4"
        ],
        "hint": "Sort both strings or check character frequency count equality.",
        "starter": {
            "python": "def solve(s, t):\n    # Write your logic here\n    return False",
            "javascript": "function solve(s, t) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(s, t):\n    from collections import Counter\n    return Counter(s) == Counter(t)",
            "javascript": "function solve(s, t) {\n    if (s.length !== t.length) return false;\n    const map = {};\n    for (const c of s) map[c] = (map[c] || 0) + 1;\n    for (const c of t) {\n        if (!map[c]) return false;\n        map[c]--;\n    }\n    return true;\n}"
        },
        "testCases": [
            {
                "args": [
                    "anagram",
                    "nagaram"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "rat",
                    "car"
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-17",
        "company": "accenture",
        "category": "service",
        "number": 17,
        "title": "Rotate Array Left by K Positions",
        "difficulty": "Easy",
        "topic": "Arrays",
        "frequency": "90% in Accenture ASE",
        "context": "Circular buffer rotation in Accenture",
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
        "returnType": "int[]",
        "description": "Given an array `nums`, rotate the array to the left by `k` steps, where `k` is non-negative.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "0 <= k <= 10^5"
        ],
        "hint": "k = k % len(nums). Return nums[k:] + nums[:k].",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    if not nums: return []\n    k = k % len(nums)\n    return nums[k:] + nums[:k]",
            "javascript": "function solve(nums, k) {\n    if (!nums.length) return [];\n    k = k % nums.length;\n    return [...nums.slice(k), ...nums.slice(0, k)];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    2
                ],
                "expected": [
                    3,
                    4,
                    5,
                    1,
                    2
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        3
                    ],
                    4
                ],
                "expected": [
                    2,
                    3,
                    1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-18",
        "company": "accenture",
        "category": "service",
        "number": 18,
        "title": "Longest Consecutive Sequence Length",
        "difficulty": "Medium",
        "topic": "Hash Sets",
        "frequency": "90% in Accenture FSE",
        "context": "Accenture FSE O(n) algorithmic challenge",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given unsorted integer array `nums`, return the length of the longest consecutive elements sequence in O(n) time.",
        "constraints": [
            "0 <= nums.length <= 10^5",
            "-10^9 <= nums[i] <= 10^9"
        ],
        "hint": "Insert into set. Only expand when x - 1 is not in set (start of streak).",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    s = set(nums)\n    best = 0\n    for x in s:\n        if x - 1 not in s:\n            y = x + 1\n            while y in s: y += 1\n            best = max(best, y - x)\n    return best",
            "javascript": "function solve(nums) {\n    const s = new Set(nums);\n    let best = 0;\n    for (const x of s) {\n        if (!s.has(x - 1)) {\n            let y = x + 1;\n            while (s.has(y)) y++;\n            best = Math.max(best, y - x);\n        }\n    }\n    return best;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        100,
                        4,
                        200,
                        1,
                        3,
                        2
                    ]
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        0,
                        3,
                        7,
                        2,
                        5,
                        8,
                        4,
                        6,
                        0,
                        1
                    ]
                ],
                "expected": 9,
                "isHidden": false
            }
        ]
    },
    {
        "id": "acc-19",
        "company": "accenture",
        "category": "service",
        "number": 19,
        "title": "Balanced Parentheses Validator",
        "difficulty": "Easy",
        "topic": "Stack",
        "frequency": "97% in Accenture ASE",
        "context": "Syntax verification in Accenture assessment",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid and properly closed in correct order.",
        "constraints": [
            "1 <= s.length <= 10^4"
        ],
        "hint": "Use a stack. Push open brackets, pop and verify matching on closing brackets.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return False",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    pairs = {')': '(', '}': '{', ']': '['}\n    stack = []\n    for c in s:\n        if c in pairs:\n            if not stack or stack.pop() != pairs[c]: return False\n        else:\n            stack.append(c)\n    return len(stack) == 0",
            "javascript": "function solve(s) {\n    const pairs = { ')': '(', '}': '{', ']': '[' };\n    const stack = [];\n    for (const c of s) {\n        if (pairs[c]) {\n            if (!stack.length || stack.pop() !== pairs[c]) return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    "()[]{}"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "(]"
                ],
                "expected": false,
                "isHidden": false
            },
            {
                "args": [
                    "{[]}"
                ],
                "expected": true,
                "isHidden": true
            }
        ]
    },
    {
        "id": "acc-20",
        "company": "accenture",
        "category": "service",
        "number": 20,
        "title": "Spiral Order Matrix Traversal",
        "difficulty": "Medium",
        "topic": "2D Arrays",
        "frequency": "90% in Accenture FSE",
        "context": "Accenture 2D traversal challenge",
        "fnName": "solve",
        "params": [
            {
                "name": "matrix",
                "type": "int[][]"
            }
        ],
        "returnType": "int[]",
        "description": "Given an `m x n` matrix, return all elements of the matrix in spiral order (clockwise starting from top-left).",
        "constraints": [
            "1 <= matrix.length, matrix[0].length <= 20"
        ],
        "hint": "Maintain top, bottom, left, right bounds and loop while top <= bottom and left <= right.",
        "starter": {
            "python": "def solve(matrix):\n    # Write your logic here\n    return []",
            "javascript": "function solve(matrix) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(matrix):\n    if not matrix: return []\n    res = []\n    top, bot = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    while top <= bot and left <= right:\n        for c in range(left, right + 1): res.append(matrix[top][c])\n        top += 1\n        for r in range(top, bot + 1): res.append(matrix[r][right])\n        right -= 1\n        if top <= bot:\n            for c in range(right, left - 1, -1): res.append(matrix[bot][c])\n            bot -= 1\n        if left <= right:\n            for r in range(bot, top - 1, -1): res.append(matrix[r][left])\n            left += 1\n    return res",
            "javascript": "function solve(matrix) {\n    if (!matrix.length) return [];\n    const res = [];\n    let top = 0, bot = matrix.length - 1, left = 0, right = matrix[0].length - 1;\n    while (top <= bot && left <= right) {\n        for (let c = left; c <= right; c++) res.push(matrix[top][c]);\n        top++;\n        for (let r = top; r <= bot; r++) res.push(matrix[r][right]);\n        right--;\n        if (top <= bot) {\n            for (let c = right; c >= left; c--) res.push(matrix[bot][c]);\n            bot--;\n        }\n        if (left <= right) {\n            for (let r = bot; r >= top; r--) res.push(matrix[r][left]);\n            left++;\n        }\n    }\n    return res;\n}"
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
                    3,
                    6,
                    9,
                    8,
                    7,
                    4,
                    5
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            1,
                            2
                        ],
                        [
                            3,
                            4
                        ]
                    ]
                ],
                "expected": [
                    1,
                    2,
                    4,
                    3
                ],
                "isHidden": false
            }
        ]
    }
];
