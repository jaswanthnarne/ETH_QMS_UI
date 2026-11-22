export const WIPRO_QUESTIONS = [
    {
        "id": "wip-1",
        "company": "wipro",
        "category": "service",
        "number": 1,
        "title": "Sum of Sums of Digits",
        "difficulty": "Easy",
        "topic": "Number Theory",
        "frequency": "94% in Wipro Elite NLTH",
        "context": "Wipro NLTH mandatory question",
        "fnName": "solve",
        "params": [
            {
                "name": "num",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given a number `num`, calculate the sum of digits of all prefix numbers. E.g. for 582109, prefixes are 5, 58, 582, 5821, 58210, 582109. Sum all their digits.",
        "constraints": [
            "0 <= num <= 10^9"
        ],
        "hint": "Digit at index i (from left, 0-indexed) contributes d * (len - i) to the total sum.",
        "starter": {
            "python": "def solve(num):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(num) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(num):\n    s = str(num)\n    n = len(s)\n    return sum(int(s[i]) * (n - i) for i in range(n))",
            "javascript": "function solve(num) {\n    const s = String(num);\n    let total = 0;\n    for (let i = 0; i < s.length; i++) total += Number(s[i]) * (s.length - i);\n    return total;\n}"
        },
        "testCases": [
            {
                "args": [
                    582109
                ],
                "expected": 85,
                "isHidden": false
            },
            {
                "args": [
                    123
                ],
                "expected": 10,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-2",
        "company": "wipro",
        "category": "service",
        "number": 2,
        "title": "Total Weight of a Hill Pattern",
        "difficulty": "Easy",
        "topic": "Math & Sequences",
        "frequency": "90% in Wipro Elite NLTH",
        "context": "Pattern weight accumulation in Wipro NLTH",
        "fnName": "solve",
        "params": [
            {
                "name": "totalLevels",
                "type": "int"
            },
            {
                "name": "headWeight",
                "type": "int"
            },
            {
                "name": "weightIncrement",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "A hill pattern has `totalLevels`. Level 1 has 1 node with weight `headWeight`. Each level `i` (1 to totalLevels) has `i` nodes, where node weight increases by `weightIncrement` per level. Return total weight of all nodes.",
        "constraints": [
            "1 <= totalLevels <= 100",
            "1 <= headWeight <= 100",
            "0 <= weightIncrement <= 100"
        ],
        "hint": "At level i: level weight = i * (headWeight + (i - 1) * weightIncrement). Sum across all levels.",
        "starter": {
            "python": "def solve(totalLevels, headWeight, weightIncrement):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(totalLevels, headWeight, weightIncrement) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(totalLevels, headWeight, weightIncrement):\n    total = 0\n    for i in range(1, totalLevels + 1):\n        w = headWeight + (i - 1) * weightIncrement\n        total += i * w\n    return total",
            "javascript": "function solve(totalLevels, headWeight, weightIncrement) {\n    let total = 0;\n    for (let i = 1; i <= totalLevels; i++) {\n        const w = headWeight + (i - 1) * weightIncrement;\n        total += i * w;\n    }\n    return total;\n}"
        },
        "testCases": [
            {
                "args": [
                    5,
                    10,
                    2
                ],
                "expected": 260,
                "isHidden": false
            },
            {
                "args": [
                    4,
                    1,
                    1
                ],
                "expected": 40,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-3",
        "company": "wipro",
        "category": "service",
        "number": 3,
        "title": "Encode Three Strings",
        "difficulty": "Medium",
        "topic": "String Slicing",
        "frequency": "92% in Wipro Elite NLTH",
        "context": "Three-part string encoding test in Wipro NLTH",
        "fnName": "solve",
        "params": [
            {
                "name": "s1",
                "type": "string"
            },
            {
                "name": "s2",
                "type": "string"
            },
            {
                "name": "s3",
                "type": "string"
            }
        ],
        "returnType": "string[]",
        "description": "Split each string into 3 parts: Front, Middle, End. If length % 3 == 0, parts are equal. If % 3 == 1, Middle has 1 extra char. If % 3 == 2, Front and End have 1 extra char. Combine: Output1 = Front1 + Front2 + Front3. Output2 = Middle1 + Middle2 + Middle3. Output3 = End1 + End2 + End3 (with case toggled). Return `[Output1, Output2, Output3]`.",
        "constraints": [
            "1 <= s1.length, s2.length, s3.length <= 1000"
        ],
        "hint": "Calculate part lengths: rem = len % 3. If rem==1: [L, L+1, L]; if rem==2: [L+1, L, L+1].",
        "starter": {
            "python": "def solve(s1, s2, s3):\n    # Write your logic here\n    return []",
            "javascript": "function solve(s1, s2, s3) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(s1, s2, s3):\n    def split_str(s):\n        L = len(s) // 3\n        rem = len(s) % 3\n        if rem == 0: f, m, e = L, L, L\n        elif rem == 1: f, m, e = L, L + 1, L\n        else: f, m, e = L + 1, L, L + 1\n        return s[:f], s[f:f+m], s[f+m:]\n    f1, m1, e1 = split_str(s1)\n    f2, m2, e2 = split_str(s2)\n    f3, m3, e3 = split_str(s3)\n    out1 = f1 + f2 + f3\n    out2 = m1 + m2 + m3\n    out3 = (e1 + e2 + e3).swapcase()\n    return [out1, out2, out3]",
            "javascript": "function solve(s1, s2, s3) {\n    const splitStr = (s) => {\n        const L = Math.floor(s.length / 3), rem = s.length % 3;\n        let f = L, m = L, e = L;\n        if (rem === 1) m = L + 1;\n        else if (rem === 2) { f = L + 1; e = L + 1; }\n        return [s.slice(0, f), s.slice(f, f + m), s.slice(f + m)];\n    };\n    const [f1, m1, e1] = splitStr(s1);\n    const [f2, m2, e2] = splitStr(s2);\n    const [f3, m3, e3] = splitStr(s3);\n    const out1 = f1 + f2 + f3;\n    const out2 = m1 + m2 + m3;\n    const out3 = (e1 + e2 + e3).split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');\n    return [out1, out2, out3];\n}"
        },
        "testCases": [
            {
                "args": [
                    "John",
                    "Johny",
                    "Janardhan"
                ],
                "expected": [
                    "JJoJan",
                    "ohh空间的ard",
                    "nyhan"
                ],
                "isHidden": false
            },
            {
                "args": [
                    "abc",
                    "def",
                    "ghi"
                ],
                "expected": [
                    "adg",
                    "beh",
                    "CFI"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-4",
        "company": "wipro",
        "category": "service",
        "number": 4,
        "title": "Sum of Prime Elements in Array",
        "difficulty": "Easy",
        "topic": "Prime Numbers",
        "frequency": "93% in Wipro Elite NLTH",
        "context": "Prime summation challenge in Wipro",
        "fnName": "solve",
        "params": [
            {
                "name": "arr",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an integer array `arr`, return the sum of all elements in `arr` that are prime numbers. If no prime numbers exist, return 0.",
        "constraints": [
            "1 <= arr.length <= 10^4",
            "-10^4 <= arr[i] <= 10^5"
        ],
        "hint": "A prime number is > 1 with no divisors other than 1 and itself.",
        "starter": {
            "python": "def solve(arr):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(arr) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(arr):\n    def is_p(n):\n        if n < 2: return False\n        for i in range(2, int(n**0.5) + 1):\n            if n % i == 0: return False\n        return True\n    return sum(x for x in arr if is_p(x))",
            "javascript": "function solve(arr) {\n    const isP = (n) => {\n        if (n < 2) return false;\n        for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;\n        return true;\n    };\n    return arr.reduce((acc, x) => acc + (isP(x) ? x : 0), 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        41,
                        18,
                        50,
                        43,
                        31,
                        29,
                        25,
                        59,
                        96,
                        67
                    ]
                ],
                "expected": 270,
                "isHidden": false
            },
            {
                "args": [
                    [
                        4,
                        6,
                        8,
                        9,
                        10
                    ]
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-5",
        "company": "wipro",
        "category": "service",
        "number": 5,
        "title": "Key Generator from Three 4-Digit Numbers",
        "difficulty": "Easy",
        "topic": "Digit Arithmetic",
        "frequency": "89% in Wipro Elite NLTH",
        "context": "Secure key formula in Wipro NLTH",
        "fnName": "solve",
        "params": [
            {
                "name": "input1",
                "type": "int"
            },
            {
                "name": "input2",
                "type": "int"
            },
            {
                "name": "input3",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given three 4-digit numbers: Key = (Max digit in thousands of all 3 - Min digit in thousands of all 3) appended with (Max hundreds - Min hundreds) + (Max tens - Min tens) + (Max ones - Min ones). Return resulting 4-digit key integer.",
        "constraints": [
            "1000 <= input1, input2, input3 <= 9999"
        ],
        "hint": "Extract thousands, hundreds, tens, ones from all 3 numbers. Compute (max - min) for each position.",
        "starter": {
            "python": "def solve(input1, input2, input3):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(input1, input2, input3) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(input1, input2, input3):\n    s1, s2, s3 = str(input1), str(input2), str(input3)\n    digits = []\n    for i in range(4):\n        d = [int(s1[i]), int(s2[i]), int(s3[i])]\n        digits.append(str(max(d) - min(d)))\n    return int(''.join(digits))",
            "javascript": "function solve(input1, input2, input3) {\n    const s1 = String(input1), s2 = String(input2), s3 = String(input3);\n    let key = '';\n    for (let i = 0; i < 4; i++) {\n        const vals = [Number(s1[i]), Number(s2[i]), Number(s3[i])];\n        key += String(Math.max(...vals) - Math.min(...vals));\n    }\n    return Number(key);\n}"
        },
        "testCases": [
            {
                "args": [
                    3521,
                    2452,
                    1352
                ],
                "expected": 2231,
                "isHidden": false
            },
            {
                "args": [
                    1111,
                    2222,
                    3333
                ],
                "expected": 2222,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-6",
        "company": "wipro",
        "category": "service",
        "number": 6,
        "title": "Most Frequently Occurring Digit in Array",
        "difficulty": "Easy",
        "topic": "Hashing",
        "frequency": "91% in Wipro Elite",
        "context": "Frequency analysis in Wipro",
        "fnName": "solve",
        "params": [
            {
                "name": "arr",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an array of positive integers `arr`, find the digit (0-9) that appears most frequently across all numbers. If multiple digits tie, return the largest digit among them.",
        "constraints": [
            "1 <= arr.length <= 10^4",
            "0 <= arr[i] <= 10^9"
        ],
        "hint": "Count frequency of all digits in a 10-element array. Find max frequency with highest digit index.",
        "starter": {
            "python": "def solve(arr):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(arr) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(arr):\n    counts = [0] * 10\n    for x in arr:\n        for ch in str(x):\n            counts[int(ch)] += 1\n    max_f = max(counts)\n    for d in range(9, -1, -1):\n        if counts[d] == max_f:\n            return d\n    return 0",
            "javascript": "function solve(arr) {\n    const counts = new Array(10).fill(0);\n    for (const x of arr) {\n        for (const ch of String(x)) counts[Number(ch)]++;\n    }\n    let maxF = Math.max(...counts);\n    for (let d = 9; d >= 0; d--) {\n        if (counts[d] === maxF) return d;\n    }\n    return 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1237,
                        262,
                        666,
                        140
                    ]
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    [
                        11,
                        22
                    ]
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-7",
        "company": "wipro",
        "category": "service",
        "number": 7,
        "title": "Decreasing Subsequences Counter",
        "difficulty": "Easy",
        "topic": "Arrays",
        "frequency": "87% in Wipro Elite NLTH",
        "context": "Sequence trending in Wipro NLTH",
        "fnName": "solve",
        "params": [
            {
                "name": "arr",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Return the number of strictly decreasing contiguous subsequences of length >= 2 in array `arr`.",
        "constraints": [
            "2 <= arr.length <= 10^5"
        ],
        "hint": "Iterate: if arr[i] < arr[i-1], length increases. When sequence ends or breaks, add 1 to count if length >= 2.",
        "starter": {
            "python": "def solve(arr):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(arr) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(arr):\n    count = 0\n    in_seq = False\n    for i in range(1, len(arr)):\n        if arr[i] < arr[i - 1]:\n            if not in_seq:\n                count += 1\n                in_seq = True\n        else:\n            in_seq = False\n    return count",
            "javascript": "function solve(arr) {\n    let count = 0, inSeq = false;\n    for (let i = 1; i < arr.length; i++) {\n        if (arr[i] < arr[i - 1]) {\n            if (!inSeq) { count++; inSeq = true; }\n        } else {\n            inSeq = false;\n        }\n    }\n    return count;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        11,
                        7,
                        5,
                        10,
                        4,
                        3,
                        2,
                        9,
                        8
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        4
                    ]
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-8",
        "company": "wipro",
        "category": "service",
        "number": 8,
        "title": "Sum of Non-Prime Digits in Number",
        "difficulty": "Easy",
        "topic": "Number Theory",
        "frequency": "88% in Wipro Turbo",
        "context": "Wipro Turbo digit classifier",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given a non-negative integer `n`, return the sum of all its digits that are NOT prime numbers (prime digits are 2, 3, 5, 7; non-prime digits are 0, 1, 4, 6, 8, 9).",
        "constraints": [
            "0 <= n <= 10^9"
        ],
        "hint": "Non-prime digits: {0, 1, 4, 6, 8, 9}.",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n):\n    primes = {'2', '3', '5', '7'}\n    return sum(int(ch) for ch in str(n) if ch not in primes)",
            "javascript": "function solve(n) {\n    const primes = new Set(['2', '3', '5', '7']);\n    let sum = 0;\n    for (const ch of String(n)) {\n        if (!primes.has(ch)) sum += Number(ch);\n    }\n    return sum;\n}"
        },
        "testCases": [
            {
                "args": [
                    2357
                ],
                "expected": 0,
                "isHidden": false
            },
            {
                "args": [
                    1469
                ],
                "expected": 20,
                "isHidden": false
            },
            {
                "args": [
                    246
                ],
                "expected": 10,
                "isHidden": true
            }
        ]
    },
    {
        "id": "wip-9",
        "company": "wipro",
        "category": "service",
        "number": 9,
        "title": "Nth Fibonacci Number Modulo 10^9+7",
        "difficulty": "Easy",
        "topic": "Sequences & DP",
        "frequency": "95% in Wipro Elite",
        "context": "Classic Wipro Fibonacci term test",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given `n` (0-indexed where F(0) = 0, F(1) = 1), return the `n`th Fibonacci number modulo `10^9 + 7`.",
        "constraints": [
            "0 <= n <= 10^5"
        ],
        "hint": "Iterate using a, b = b, (a + b) % 1000000007.",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n):\n    if n <= 1: return n\n    a, b = 0, 1\n    MOD = 10**9 + 7\n    for _ in range(n - 1):\n        a, b = b, (a + b) % MOD\n    return b",
            "javascript": "function solve(n) {\n    if (n <= 1) return n;\n    let a = 0, b = 1, MOD = 1000000007;\n    for (let i = 0; i < n - 1; i++) {\n        const next = (a + b) % MOD;\n        a = b;\n        b = next;\n    }\n    return b;\n}"
        },
        "testCases": [
            {
                "args": [
                    2
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    10
                ],
                "expected": 55,
                "isHidden": false
            },
            {
                "args": [
                    0
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "wip-10",
        "company": "wipro",
        "category": "service",
        "number": 10,
        "title": "Alternate Add and Subtract Series Sum",
        "difficulty": "Easy",
        "topic": "Math",
        "frequency": "86% in Wipro Elite NLTH",
        "context": "Series arithmetic in Wipro",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            },
            {
                "name": "opt",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given `n` and option `opt`. If `opt == 1`: compute `n - (n-1) + (n-2) - (n-3) ...`. If `opt == 2`: compute `-n + (n-1) - (n-2) + (n-3) ...`. Return the final result.",
        "constraints": [
            "1 <= n <= 10^5",
            "opt in {1, 2}"
        ],
        "hint": "Alternate sign starting positive for opt 1, or negative for opt 2.",
        "starter": {
            "python": "def solve(n, opt):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n, opt) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n, opt):\n    sign = 1 if opt == 1 else -1\n    ans = 0\n    for x in range(n, 0, -1):\n        ans += sign * x\n        sign = -sign\n    return ans",
            "javascript": "function solve(n, opt) {\n    let sign = opt === 1 ? 1 : -1, ans = 0;\n    for (let x = n; x >= 1; x--) {\n        ans += sign * x;\n        sign = -sign;\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    6,
                    1
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    6,
                    2
                ],
                "expected": -3,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-11",
        "company": "wipro",
        "category": "service",
        "number": 11,
        "title": "Count Distinct Absolute Values in Sorted Array",
        "difficulty": "Easy",
        "topic": "Two Pointers",
        "frequency": "89% in Wipro Elite",
        "context": "Wipro distinct element evaluation",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given sorted integer array `nums`, return the count of distinct absolute values in O(n) time and O(1) space.",
        "constraints": [
            "1 <= nums.length <= 10^5"
        ],
        "hint": "Two pointers from left and right comparing abs(nums[l]) vs abs(nums[r]).",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    return len(set(abs(x) for x in nums))",
            "javascript": "function solve(nums) {\n    return new Set(nums.map(Math.abs)).size;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        -3,
                        -2,
                        0,
                        3,
                        4,
                        5
                    ]
                ],
                "expected": 5,
                "isHidden": false
            },
            {
                "args": [
                    [
                        -1,
                        -1,
                        1,
                        1
                    ]
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-12",
        "company": "wipro",
        "category": "service",
        "number": 12,
        "title": "Find Missing Number from 1 to N",
        "difficulty": "Easy",
        "topic": "Bitwise XOR & Math",
        "frequency": "95% in Wipro Elite NLTH",
        "context": "Wipro register sequence check",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
        "constraints": [
            "1 <= nums.length <= 10^4"
        ],
        "hint": "Sum of 0..n is n*(n+1)/2. Subtract sum of nums.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    n = len(nums)\n    return n * (n + 1) // 2 - sum(nums)",
            "javascript": "function solve(nums) {\n    const n = nums.length;\n    return (n * (n + 1)) / 2 - nums.reduce((a, b) => a + b, 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        0,
                        1
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        0,
                        1
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        9,
                        6,
                        4,
                        2,
                        3,
                        5,
                        7,
                        0,
                        1
                    ]
                ],
                "expected": 8,
                "isHidden": true
            }
        ]
    },
    {
        "id": "wip-13",
        "company": "wipro",
        "category": "service",
        "number": 13,
        "title": "Remove Duplicate Words from String",
        "difficulty": "Easy",
        "topic": "Strings & Sets",
        "frequency": "92% in Wipro Elite",
        "context": "Sentence deduplication in Wipro",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given a string `s`, remove all duplicate words, retaining only their first occurrence. Return the resulting space-separated string.",
        "constraints": [
            "1 <= s.length <= 10^4"
        ],
        "hint": "Split into words, track seen words in a Set.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return ''",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return '';\n}"
        },
        "solution": {
            "python": "def solve(s):\n    seen = set()\n    res = []\n    for w in s.split():\n        if w not in seen:\n            seen.add(w)\n            res.append(w)\n    return ' '.join(res)",
            "javascript": "function solve(s) {\n    const seen = new Set(), res = [];\n    for (const w of s.split(' ')) {\n        if (!seen.has(w)) {\n            seen.add(w);\n            res.push(w);\n        }\n    }\n    return res.join(' ');\n}"
        },
        "testCases": [
            {
                "args": [
                    "good morning morning have a good day"
                ],
                "expected": "good morning have a day",
                "isHidden": false
            },
            {
                "args": [
                    "one one one"
                ],
                "expected": "one",
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-14",
        "company": "wipro",
        "category": "service",
        "number": 14,
        "title": "Majority Element in Array (Boyer-Moore)",
        "difficulty": "Easy",
        "topic": "Counting",
        "frequency": "94% in Wipro Elite NLTH",
        "context": "Wipro voting algorithm question",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given array `nums` of size `n`, return the majority element (element that appears strictly more than `n / 2` times). Assume majority element always exists.",
        "constraints": [
            "1 <= nums.length <= 5 * 10^4"
        ],
        "hint": "Boyer-Moore Voting Algorithm: candidate and count in O(n) time and O(1) space.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    cand, count = None, 0\n    for x in nums:\n        if count == 0: cand = x\n        count += 1 if x == cand else -1\n    return cand",
            "javascript": "function solve(nums) {\n    let cand = null, count = 0;\n    for (const x of nums) {\n        if (count === 0) cand = x;\n        count += (x === cand ? 1 : -1);\n    }\n    return cand;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        2,
                        3
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        2,
                        2,
                        1,
                        1,
                        1,
                        2,
                        2
                    ]
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-15",
        "company": "wipro",
        "category": "service",
        "number": 15,
        "title": "Sort Array of 0s, 1s, and 2s (Dutch National Flag)",
        "difficulty": "Easy",
        "topic": "Three Pointers",
        "frequency": "96% in Wipro Elite",
        "context": "Wipro linear in-place sorting test",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given an array `nums` with `n` objects colored red, white, or blue (represented by integers 0, 1, and 2), sort them in-place in linear time so that objects of the same color are adjacent.",
        "constraints": [
            "1 <= nums.length <= 1000",
            "nums[i] in {0, 1, 2}"
        ],
        "hint": "Three pointers: low, mid, high. Swap nums[mid] with nums[low] if 0, with nums[high] if 2.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    arr = list(nums)\n    l, m, h = 0, 0, len(arr) - 1\n    while m <= h:\n        if arr[m] == 0:\n            arr[l], arr[m] = arr[m], arr[l]\n            l += 1; m += 1\n        elif arr[m] == 1: m += 1\n        else:\n            arr[m], arr[h] = arr[h], arr[m]\n            h -= 1\n    return arr",
            "javascript": "function solve(nums) {\n    const arr = [...nums];\n    let l = 0, m = 0, h = arr.length - 1;\n    while (m <= h) {\n        if (arr[m] === 0) {\n            [arr[l], arr[m]] = [arr[m], arr[l]];\n            l++; m++;\n        } else if (arr[m] === 1) {\n            m++;\n        } else {\n            [arr[m], arr[h]] = [arr[h], arr[m]];\n            h--;\n        }\n    }\n    return arr;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        0,
                        2,
                        1,
                        1,
                        0
                    ]
                ],
                "expected": [
                    0,
                    0,
                    1,
                    1,
                    2,
                    2
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        2,
                        0,
                        1
                    ]
                ],
                "expected": [
                    0,
                    1,
                    2
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-16",
        "company": "wipro",
        "category": "service",
        "number": 16,
        "title": "Hamming Weight (Count Set Bits)",
        "difficulty": "Easy",
        "topic": "Bit Manipulation",
        "frequency": "93% in Wipro Elite NLTH",
        "context": "Bit counting in Wipro assessment",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given a positive integer `n`, return the number of set bits (1-bits) in its binary representation.",
        "constraints": [
            "1 <= n <= 2^31 - 1"
        ],
        "hint": "Brian Kernighan algorithm: while n > 0: n = n & (n - 1); count += 1.",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n):\n    c = 0\n    while n > 0:\n        n &= (n - 1)\n        c += 1\n    return c",
            "javascript": "function solve(n) {\n    let c = 0;\n    while (n > 0) {\n        n &= (n - 1);\n        c++;\n    }\n    return c;\n}"
        },
        "testCases": [
            {
                "args": [
                    11
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    128
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    2147483647
                ],
                "expected": 31,
                "isHidden": true
            }
        ]
    },
    {
        "id": "wip-17",
        "company": "wipro",
        "category": "service",
        "number": 17,
        "title": "Check Power of Two",
        "difficulty": "Easy",
        "topic": "Bitwise",
        "frequency": "94% in Wipro Elite",
        "context": "Wipro bitwise speed challenge",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "bool",
        "description": "Given an integer `n`, return `true` if it is a power of two, otherwise return `false`.",
        "constraints": [
            "-2^31 <= n <= 2^31 - 1"
        ],
        "hint": "A power of two has exactly 1 bit set: n > 0 and (n & (n - 1)) == 0.",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return False",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(n):\n    return n > 0 and (n & (n - 1)) == 0",
            "javascript": "function solve(n) {\n    return n > 0 && (n & (n - 1)) === 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    1
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    16
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    3
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "wip-18",
        "company": "wipro",
        "category": "service",
        "number": 18,
        "title": "Find Unique Character in String",
        "difficulty": "Easy",
        "topic": "Hashing",
        "frequency": "90% in Wipro Elite NLTH",
        "context": "First non-repeating character in Wipro",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
        "constraints": [
            "1 <= s.length <= 10^5"
        ],
        "hint": "Count character frequencies, then loop through string to find first with count == 1.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    from collections import Counter\n    counts = Counter(s)\n    for i, c in enumerate(s):\n        if counts[c] == 1: return i\n    return -1",
            "javascript": "function solve(s) {\n    const counts = {};\n    for (const c of s) counts[c] = (counts[c] || 0) + 1;\n    for (let i = 0; i < s.length; i++) {\n        if (counts[s[i]] === 1) return i;\n    }\n    return -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    "leetcode"
                ],
                "expected": 0,
                "isHidden": false
            },
            {
                "args": [
                    "loveleetcode"
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    "aabb"
                ],
                "expected": -1,
                "isHidden": true
            }
        ]
    },
    {
        "id": "wip-19",
        "company": "wipro",
        "category": "service",
        "number": 19,
        "title": "Reverse Integer with 32-Bit Overflow Check",
        "difficulty": "Medium",
        "topic": "Math",
        "frequency": "89% in Wipro Turbo",
        "context": "Numeric bounds testing in Wipro",
        "fnName": "solve",
        "params": [
            {
                "name": "x",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside the signed 32-bit integer range `[-2^31, 2^31 - 1]`, return 0.",
        "constraints": [
            "-2^31 <= x <= 2^31 - 1"
        ],
        "hint": "Extract digits with modulo 10. Check overflow against 2^31 - 1.",
        "starter": {
            "python": "def solve(x):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(x) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(x):\n    sign = -1 if x < 0 else 1\n    rev = int(str(abs(x))[::-1]) * sign\n    if rev < -2**31 or rev > 2**31 - 1:\n        return 0\n    return rev",
            "javascript": "function solve(x) {\n    const sign = x < 0 ? -1 : 1;\n    const rev = Number(String(Math.abs(x)).split('').reverse().join('')) * sign;\n    if (rev < -Math.pow(2, 31) || rev > Math.pow(2, 31) - 1) return 0;\n    return rev;\n}"
        },
        "testCases": [
            {
                "args": [
                    123
                ],
                "expected": 321,
                "isHidden": false
            },
            {
                "args": [
                    -123
                ],
                "expected": -321,
                "isHidden": false
            },
            {
                "args": [
                    1534236469
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "wip-20",
        "company": "wipro",
        "category": "service",
        "number": 20,
        "title": "Pascal's Triangle Row N",
        "difficulty": "Easy",
        "topic": "Math & Combinatorics",
        "frequency": "91% in Wipro Elite",
        "context": "Combinatoric triangle row generator in Wipro",
        "fnName": "solve",
        "params": [
            {
                "name": "rowIndex",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given integer `rowIndex`, return the `rowIndex`th (0-indexed) row of Pascal's triangle.",
        "constraints": [
            "0 <= rowIndex <= 33"
        ],
        "hint": "Generate iteratively: row[i] = row[i-1] * (rowIndex - i + 1) / i.",
        "starter": {
            "python": "def solve(rowIndex):\n    # Write your logic here\n    return []",
            "javascript": "function solve(rowIndex) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(rowIndex):\n    row = [1]\n    for i in range(1, rowIndex + 1):\n        row.append(row[-1] * (rowIndex - i + 1) // i)\n    return row",
            "javascript": "function solve(rowIndex) {\n    const row = [1];\n    for (let i = 1; i <= rowIndex; i++) {\n        row.push(Math.round((row[row.length - 1] * (rowIndex - i + 1)) / i));\n    }\n    return row;\n}"
        },
        "testCases": [
            {
                "args": [
                    3
                ],
                "expected": [
                    1,
                    3,
                    3,
                    1
                ],
                "isHidden": false
            },
            {
                "args": [
                    0
                ],
                "expected": [
                    1
                ],
                "isHidden": false
            },
            {
                "args": [
                    1
                ],
                "expected": [
                    1,
                    1
                ],
                "isHidden": true
            }
        ]
    }
];
