export const TCS_QUESTIONS = [
    {
        "id": "tcs-1",
        "company": "tcs",
        "category": "service",
        "number": 1,
        "title": "Two and Four Wheeler Count",
        "difficulty": "Easy",
        "topic": "Math & Equations",
        "frequency": "95% in TCS NQT 2024-25",
        "context": "Asked in TCS NQT Cognitive & Ninja Coding Round",
        "fnName": "solve",
        "params": [
            {
                "name": "v",
                "type": "int"
            },
            {
                "name": "w",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given total vehicles `v` and total wheels `w`, determine the number of two-wheelers (`tw`) and four-wheelers (`fw`). If `w < 2`, `w <= v`, or `w % 2 != 0`, or if no valid whole non-negative solution exists, return `[-1, -1]`. Otherwise return `[tw, fw]`.",
        "constraints": [
            "2 <= v <= 5000",
            "2 <= w <= 20000"
        ],
        "hint": "tw + fw = v and 2*tw + 4*fw = w. Solving gives fw = (w - 2*v) / 2 and tw = v - fw.",
        "starter": {
            "python": "def solve(v, w):\n    # Write your logic here\n    return []",
            "javascript": "function solve(v, w) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(v, w):\n    if w < 2 or w <= v or w % 2 != 0:\n        return [-1, -1]\n    fw = (w - 2 * v) // 2\n    tw = v - fw\n    if tw < 0 or fw < 0 or (2 * tw + 4 * fw) != w:\n        return [-1, -1]\n    return [tw, fw]",
            "javascript": "function solve(v, w) {\n    if (w < 2 || w <= v || w % 2 !== 0) return [-1, -1];\n    const fw = Math.floor((w - 2 * v) / 2);\n    const tw = v - fw;\n    if (tw < 0 || fw < 0 || (2 * tw + 4 * fw) !== w) return [-1, -1];\n    return [tw, fw];\n}"
        },
        "testCases": [
            {
                "args": [
                    200,
                    540
                ],
                "expected": [
                    130,
                    70
                ],
                "isHidden": false
            },
            {
                "args": [
                    100,
                    200
                ],
                "expected": [
                    100,
                    0
                ],
                "isHidden": false
            },
            {
                "args": [
                    50,
                    150
                ],
                "expected": [
                    25,
                    25
                ],
                "isHidden": true
            },
            {
                "args": [
                    30,
                    40
                ],
                "expected": [
                    -1,
                    -1
                ],
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-2",
        "company": "tcs",
        "category": "service",
        "number": 2,
        "title": "Supermarket Non-Zero Price Product",
        "difficulty": "Easy",
        "topic": "Number Theory",
        "frequency": "90% in TCS NQT 2024",
        "context": "Supermarket billing system inventory question in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given a non-negative integer `n`, calculate the product of all its non-zero digits. If all digits are zero or n is 0, return 0.",
        "constraints": [
            "0 <= n <= 10^9"
        ],
        "hint": "Extract digits using modulo 10 and multiply only non-zero digits.",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n):\n    if n == 0:\n        return 0\n    prod = 1\n    has_non_zero = False\n    for ch in str(n):\n        d = int(ch)\n        if d != 0:\n            prod *= d\n            has_non_zero = True\n    return prod if has_non_zero else 0",
            "javascript": "function solve(n) {\n    if (n === 0) return 0;\n    let prod = 1, hasNonZero = false;\n    for (const ch of String(n)) {\n        const d = Number(ch);\n        if (d !== 0) {\n            prod *= d;\n            hasNonZero = true;\n        }\n    }\n    return hasNonZero ? prod : 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    5244
                ],
                "expected": 160,
                "isHidden": false
            },
            {
                "args": [
                    10203
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    1000
                ],
                "expected": 1,
                "isHidden": true
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
        "id": "tcs-3",
        "company": "tcs",
        "category": "service",
        "number": 3,
        "title": "Jar of Candies Counter",
        "difficulty": "Easy",
        "topic": "Conditionals & Simulation",
        "frequency": "88% in TCS Ninja 2024",
        "context": "Vending machine inventory question in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "capacity",
                "type": "int"
            },
            {
                "name": "k",
                "type": "int"
            },
            {
                "name": "ordered",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "A jar has capacity `capacity` candies. If candies in jar fall strictly below `k`, it is refilled to `capacity`. If a customer orders `ordered` candies: if `ordered <= 0` or `ordered > capacity`, transaction is invalid, return `[-1, -1]`. Otherwise return `[candies_sold, candies_left_in_jar]`.",
        "constraints": [
            "10 <= capacity <= 500",
            "1 <= k <= capacity / 2"
        ],
        "hint": "Subtract ordered candies from capacity. If remaining < k, remaining resets to capacity.",
        "starter": {
            "python": "def solve(capacity, k, ordered):\n    # Write your logic here\n    return []",
            "javascript": "function solve(capacity, k, ordered) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(capacity, k, ordered):\n    if ordered <= 0 or ordered > capacity:\n        return [-1, -1]\n    rem = capacity - ordered\n    if rem < k:\n        rem = capacity\n    return [ordered, rem]",
            "javascript": "function solve(capacity, k, ordered) {\n    if (ordered <= 0 || ordered > capacity) return [-1, -1];\n    let rem = capacity - ordered;\n    if (rem < k) rem = capacity;\n    return [ordered, rem];\n}"
        },
        "testCases": [
            {
                "args": [
                    10,
                    5,
                    3
                ],
                "expected": [
                    3,
                    7
                ],
                "isHidden": false
            },
            {
                "args": [
                    10,
                    5,
                    6
                ],
                "expected": [
                    6,
                    10
                ],
                "isHidden": false
            },
            {
                "args": [
                    10,
                    5,
                    12
                ],
                "expected": [
                    -1,
                    -1
                ],
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-4",
        "company": "tcs",
        "category": "service",
        "number": 4,
        "title": "Fittest Trainee Oxygen Level",
        "difficulty": "Easy",
        "topic": "Arrays & Averages",
        "frequency": "85% in TCS NQT",
        "context": "Military academy fitness assessment in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "readings",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "9 oxygen readings are given for 3 trainees over 3 rounds (round 1: [t1, t2, t3], round 2: [t1, t2, t3], round 3: [t1, t2, t3]). If any reading is not between 1 and 100, return `[-1]`. Calculate the rounded average oxygen level for each trainee (1-indexed: Trainee 1, 2, 3). If all averages are below 70, return `[-1]`. Otherwise return the indices of trainees who have the highest average oxygen level (sorted ascending).",
        "constraints": [
            "readings.length == 9"
        ],
        "hint": "Averages: t1 = (r0+r3+r6)/3, t2 = (r1+r4+r7)/3, t3 = (r2+r5+r8)/3. Round using Math.round.",
        "starter": {
            "python": "def solve(readings):\n    # Write your logic here\n    return []",
            "javascript": "function solve(readings) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(readings):\n    if len(readings) != 9 or any(r < 1 or r > 100 for r in readings):\n        return [-1]\n    t1 = round((readings[0] + readings[3] + readings[6]) / 3)\n    t2 = round((readings[1] + readings[4] + readings[7]) / 3)\n    t3 = round((readings[2] + readings[5] + readings[8]) / 3)\n    max_val = max(t1, t2, t3)\n    if max_val < 70:\n        return [-1]\n    res = []\n    if t1 == max_val: res.append(1)\n    if t2 == max_val: res.append(2)\n    if t3 == max_val: res.append(3)\n    return res",
            "javascript": "function solve(readings) {\n    if (readings.length !== 9 || readings.some(r => r < 1 || r > 100)) return [-1];\n    const t1 = Math.round((readings[0] + readings[3] + readings[6]) / 3);\n    const t2 = Math.round((readings[1] + readings[4] + readings[7]) / 3);\n    const t3 = Math.round((readings[2] + readings[5] + readings[8]) / 3);\n    const maxVal = Math.max(t1, t2, t3);\n    if (maxVal < 70) return [-1];\n    const res = [];\n    if (t1 === maxVal) res.push(1);\n    if (t2 === maxVal) res.push(2);\n    if (t3 === maxVal) res.push(3);\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        95,
                        92,
                        95,
                        92,
                        90,
                        92,
                        90,
                        92,
                        90
                    ]
                ],
                "expected": [
                    1
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        90,
                        90,
                        90,
                        90,
                        90,
                        90,
                        90,
                        90,
                        90
                    ]
                ],
                "expected": [
                    1,
                    2,
                    3
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        60,
                        65,
                        60,
                        62,
                        60,
                        60,
                        60,
                        60,
                        60
                    ]
                ],
                "expected": [
                    -1
                ],
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-5",
        "company": "tcs",
        "category": "service",
        "number": 5,
        "title": "Washing Machine Fuzzy Time",
        "difficulty": "Easy",
        "topic": "Conditionals",
        "frequency": "80% in TCS NQT",
        "context": "Smart appliance fuzzy logic in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "weight",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given clothes weight in grams: If `weight == 0`, time is 0 min. If `0 < weight <= 2000`, time is 25 min. If `2000 < weight <= 4000`, time is 35 min. If `4000 < weight <= 7000`, time is 45 min. If `weight > 7000`, machine is overloaded, return -1. If `weight < 0`, return -1.",
        "constraints": [
            "-1000 <= weight <= 15000"
        ],
        "hint": "Use simple chained if-else condition branches.",
        "starter": {
            "python": "def solve(weight):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(weight) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(weight):\n    if weight < 0 or weight > 7000:\n        return -1\n    if weight == 0:\n        return 0\n    if weight <= 2000:\n        return 25\n    if weight <= 4000:\n        return 35\n    return 45",
            "javascript": "function solve(weight) {\n    if (weight < 0 || weight > 7000) return -1;\n    if (weight === 0) return 0;\n    if (weight <= 2000) return 25;\n    if (weight <= 4000) return 35;\n    return 45;\n}"
        },
        "testCases": [
            {
                "args": [
                    2000
                ],
                "expected": 25,
                "isHidden": false
            },
            {
                "args": [
                    3500
                ],
                "expected": 35,
                "isHidden": false
            },
            {
                "args": [
                    8000
                ],
                "expected": -1,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-6",
        "company": "tcs",
        "category": "service",
        "number": 6,
        "title": "Count Pairs with Difference K",
        "difficulty": "Easy",
        "topic": "Hashing & Sets",
        "frequency": "92% in TCS Digital",
        "context": "TCS Digital Round 1 standard challenge",
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
        "returnType": "int",
        "description": "Given an integer array `nums` and integer `k`, return the number of unique pairs `(nums[i], nums[j])` such that `nums[i] - nums[j] == k` and `i != j`.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "0 <= k <= 10^7"
        ],
        "hint": "If k == 0 count elements with frequency > 1. Else check if (x + k) exists in the set.",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    from collections import Counter\n    counts = Counter(nums)\n    if k == 0:\n        return sum(1 for val in counts.values() if val > 1)\n    return sum(1 for num in counts if num + k in counts)",
            "javascript": "function solve(nums, k) {\n    const map = new Map();\n    for (const n of nums) map.set(n, (map.get(n) || 0) + 1);\n    let ans = 0;\n    if (k === 0) {\n        for (const count of map.values()) if (count > 1) ans++;\n    } else {\n        for (const num of map.keys()) if (map.has(num + k)) ans++;\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        5,
                        3,
                        4,
                        2
                    ],
                    2
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
                        4,
                        5
                    ],
                    1
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        3,
                        1,
                        5,
                        4
                    ],
                    0
                ],
                "expected": 1,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-7",
        "company": "tcs",
        "category": "service",
        "number": 7,
        "title": "Monkeys on Tree (Banana and Peanut)",
        "difficulty": "Easy",
        "topic": "Math & Greedy",
        "frequency": "84% in TCS NQT",
        "context": "Park ranger inventory simulation in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            },
            {
                "name": "k",
                "type": "int"
            },
            {
                "name": "j",
                "type": "int"
            },
            {
                "name": "m",
                "type": "int"
            },
            {
                "name": "p",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Total monkeys `n`. One monkey eats `k` bananas or `j` peanuts. Total bananas `m`, total peanuts `p`. Calculate monkeys remaining on tree. (Each fed monkey leaves the tree). Return monkeys remaining.",
        "constraints": [
            "1 <= n, k, j <= 1000",
            "0 <= m, p <= 10000"
        ],
        "hint": "Monkeys fed by bananas = m / k. Monkeys fed by peanuts = p / j. Remaining food can feed at most 1 more monkey.",
        "starter": {
            "python": "def solve(n, k, j, m, p):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n, k, j, m, p) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n, k, j, m, p):\n    if k <= 0 or j <= 0:\n        return -1\n    ate_b = m // k\n    rem_b = m % k\n    ate_p = p // j\n    rem_p = p % j\n    total_fed = ate_b + ate_p\n    if (rem_b > 0 or rem_p > 0) and (total_fed < n):\n        total_fed += 1\n    return max(0, n - total_fed)",
            "javascript": "function solve(n, k, j, m, p) {\n    if (k <= 0 || j <= 0) return -1;\n    const ateB = Math.floor(m / k);\n    const remB = m % k;\n    const ateP = Math.floor(p / j);\n    const remP = p % j;\n    let totalFed = ateB + ateP;\n    if ((remB > 0 || remP > 0) && totalFed < n) totalFed += 1;\n    return Math.max(0, n - totalFed);\n}"
        },
        "testCases": [
            {
                "args": [
                    20,
                    2,
                    3,
                    12,
                    12
                ],
                "expected": 10,
                "isHidden": false
            },
            {
                "args": [
                    10,
                    2,
                    2,
                    20,
                    0
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "tcs-8",
        "company": "tcs",
        "category": "service",
        "number": 8,
        "title": "Base 17 to Decimal Converter",
        "difficulty": "Easy",
        "topic": "Base Conversion",
        "frequency": "86% in TCS NQT",
        "context": "Data compression question in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a string `s` representing a valid base-17 number (digits: 0-9 and A-G/a-g where A=10, B=11... G=16), convert it to its decimal integer value.",
        "constraints": [
            "1 <= s.length <= 8"
        ],
        "hint": "Iterate from left to right: val = val * 17 + digitValue.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    return int(s, 17)",
            "javascript": "function solve(s) {\n    return parseInt(s, 17);\n}"
        },
        "testCases": [
            {
                "args": [
                    "23GF"
                ],
                "expected": 10980,
                "isHidden": false
            },
            {
                "args": [
                    "1A"
                ],
                "expected": 27,
                "isHidden": false
            },
            {
                "args": [
                    "G"
                ],
                "expected": 16,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-9",
        "company": "tcs",
        "category": "service",
        "number": 9,
        "title": "Maximum Subarray Product",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "89% in TCS Prime",
        "context": "TCS Prime algorithmic assessment",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an integer array `nums`, find a contiguous non-empty subarray that has the largest product, and return that product.",
        "constraints": [
            "1 <= nums.length <= 2 * 10^4",
            "-10 <= nums[i] <= 10"
        ],
        "hint": "Track both max_product and min_product because a negative multiplied by a negative becomes positive.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    max_prod = min_prod = ans = nums[0]\n    for x in nums[1:]:\n        if x < 0:\n            max_prod, min_prod = min_prod, max_prod\n        max_prod = max(x, max_prod * x)\n        min_prod = min(x, min_prod * x)\n        ans = max(ans, max_prod)\n    return ans",
            "javascript": "function solve(nums) {\n    let maxProd = nums[0], minProd = nums[0], ans = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        const x = nums[i];\n        if (x < 0) {\n            const tmp = maxProd;\n            maxProd = minProd;\n            minProd = tmp;\n        }\n        maxProd = Math.max(x, maxProd * x);\n        minProd = Math.min(x, minProd * x);\n        ans = Math.max(ans, maxProd);\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        3,
                        -2,
                        4
                    ]
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    [
                        -2,
                        0,
                        -1
                    ]
                ],
                "expected": 0,
                "isHidden": false
            },
            {
                "args": [
                    [
                        -2,
                        3,
                        -4
                    ]
                ],
                "expected": 24,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-10",
        "company": "tcs",
        "category": "service",
        "number": 10,
        "title": "Substrings with Equal 0s and 1s",
        "difficulty": "Medium",
        "topic": "Prefix Sum & Hash Map",
        "frequency": "87% in TCS Digital",
        "context": "Signal parity analysis in TCS Digital",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a binary string `s`, count the total number of non-empty contiguous substrings that have equal number of 0's and 1's.",
        "constraints": [
            "1 <= s.length <= 10^5",
            "s[i] in {'0', '1'}"
        ],
        "hint": "Treat '0' as -1 and '1' as 1. Use a hash map of prefix sums.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    prefix = 0\n    seen = {0: 1}\n    ans = 0\n    for ch in s:\n        prefix += 1 if ch == '1' else -1\n        ans += seen.get(prefix, 0)\n        seen[prefix] = seen.get(prefix, 0) + 1\n    return ans",
            "javascript": "function solve(s) {\n    let prefix = 0, ans = 0;\n    const map = new Map([[0, 1]]);\n    for (const ch of s) {\n        prefix += (ch === '1' ? 1 : -1);\n        const count = map.get(prefix) || 0;\n        ans += count;\n        map.set(prefix, count + 1);\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    "1001011"
                ],
                "expected": 8,
                "isHidden": false
            },
            {
                "args": [
                    "010"
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    "1111"
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-11",
        "company": "tcs",
        "category": "service",
        "number": 11,
        "title": "Twin Prime Pairs in Range",
        "difficulty": "Medium",
        "topic": "Sieve of Eratosthenes",
        "frequency": "82% in TCS NQT",
        "context": "Cryptography key generation question in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "low",
                "type": "int"
            },
            {
                "name": "high",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Count the number of twin prime pairs `(p, p+2)` such that both `p` and `p+2` are prime numbers and both lie within the closed range `[low, high]`.",
        "constraints": [
            "1 <= low <= high <= 10^5"
        ],
        "hint": "Use Sieve of Eratosthenes to precompute primes up to high, then count pairs p and p+2.",
        "starter": {
            "python": "def solve(low, high):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(low, high) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(low, high):\n    if high < 3: return 0\n    is_p = [True] * (high + 1)\n    is_p[0] = is_p[1] = False\n    for i in range(2, int(high**0.5) + 1):\n        if is_p[i]:\n            for j in range(i*i, high + 1, i):\n                is_p[j] = False\n    count = 0\n    for p in range(max(2, low), high - 1):\n        if is_p[p] and is_p[p+2]:\n            count += 1\n    return count",
            "javascript": "function solve(low, high) {\n    if (high < 3) return 0;\n    const isP = new Uint8Array(high + 1).fill(1);\n    isP[0] = isP[1] = 0;\n    for (let i = 2; i * i <= high; i++) {\n        if (isP[i]) {\n            for (let j = i * i; j <= high; j += i) isP[j] = 0;\n        }\n    }\n    let count = 0;\n    for (let p = Math.max(2, low); p <= high - 2; p++) {\n        if (isP[p] && isP[p + 2]) count++;\n    }\n    return count;\n}"
        },
        "testCases": [
            {
                "args": [
                    1,
                    20
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    10,
                    30
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    1,
                    10
                ],
                "expected": 2,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-12",
        "company": "tcs",
        "category": "service",
        "number": 12,
        "title": "Rotate N x N Matrix 90 Degrees Clockwise",
        "difficulty": "Medium",
        "topic": "2D Arrays",
        "frequency": "91% in TCS Digital",
        "context": "Image processing sensor alignment in TCS Digital",
        "fnName": "solve",
        "params": [
            {
                "name": "matrix",
                "type": "int[][]"
            }
        ],
        "returnType": "int[][]",
        "description": "Given an `N x N` 2D integer matrix, rotate the matrix 90 degrees clockwise and return the rotated matrix.",
        "constraints": [
            "1 <= matrix.length <= 100",
            "matrix[i].length == matrix.length"
        ],
        "hint": "Transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row.",
        "starter": {
            "python": "def solve(matrix):\n    # Write your logic here\n    return []",
            "javascript": "function solve(matrix) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(matrix):\n    n = len(matrix)\n    res = [[matrix[n - 1 - j][i] for j in range(n)] for i in range(n)]\n    return res",
            "javascript": "function solve(matrix) {\n    const n = matrix.length;\n    const res = Array.from({ length: n }, () => new Array(n));\n    for (let i = 0; i < n; i++) {\n        for (let j = 0; j < n; j++) {\n            res[j][n - 1 - i] = matrix[i][j];\n        }\n    }\n    return res;\n}"
        },
        "testCases": [
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
                    [
                        3,
                        1
                    ],
                    [
                        4,
                        2
                    ]
                ],
                "isHidden": false
            },
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
        "id": "tcs-13",
        "company": "tcs",
        "category": "service",
        "number": 13,
        "title": "Digital Root (Repeated Digit Sum)",
        "difficulty": "Easy",
        "topic": "Math",
        "frequency": "90% in TCS NQT",
        "context": "TCS Ninja standard quantitative logic",
        "fnName": "solve",
        "params": [
            {
                "name": "num",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given an integer `num`, repeatedly add all its digits until the result has only one digit, and return it in O(1) time.",
        "constraints": [
            "0 <= num <= 2^31 - 1"
        ],
        "hint": "Digital root formula: if num == 0 return 0; if num % 9 == 0 return 9; else return num % 9.",
        "starter": {
            "python": "def solve(num):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(num) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(num):\n    if num == 0: return 0\n    return 9 if num % 9 == 0 else num % 9",
            "javascript": "function solve(num) {\n    if (num === 0) return 0;\n    return num % 9 === 0 ? 9 : num % 9;\n}"
        },
        "testCases": [
            {
                "args": [
                    38
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    0
                ],
                "expected": 0,
                "isHidden": false
            },
            {
                "args": [
                    99
                ],
                "expected": 9,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-14",
        "company": "tcs",
        "category": "service",
        "number": 14,
        "title": "Caesar Cipher Encryption with Key",
        "difficulty": "Easy",
        "topic": "Strings",
        "frequency": "86% in TCS NQT",
        "context": "Network packet obfuscation in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "string",
        "description": "Encrypt string `s` using Caesar Cipher with shift key `k`. Letters wrap around from z to a (and Z to A). Digits and special characters remain unchanged.",
        "constraints": [
            "1 <= s.length <= 10^4",
            "0 <= k <= 1000"
        ],
        "hint": "For each char: if lowercase, (ord(c) - 97 + k) % 26 + 97.",
        "starter": {
            "python": "def solve(s, k):\n    # Write your logic here\n    return ''",
            "javascript": "function solve(s, k) {\n    // Write your logic here\n    return '';\n}"
        },
        "solution": {
            "python": "def solve(s, k):\n    k = k % 26\n    res = []\n    for c in s:\n        if 'a' <= c <= 'z':\n            res.append(chr((ord(c) - ord('a') + k) % 26 + ord('a')))\n        elif 'A' <= c <= 'Z':\n            res.append(chr((ord(c) - ord('A') + k) % 26 + ord('A')))\n        else:\n            res.append(c)\n    return ''.join(res)",
            "javascript": "function solve(s, k) {\n    k = k % 26;\n    let res = '';\n    for (const c of s) {\n        const code = c.charCodeAt(0);\n        if (code >= 97 && code <= 122) {\n            res += String.fromCharCode(((code - 97 + k) % 26) + 97);\n        } else if (code >= 65 && code <= 90) {\n            res += String.fromCharCode(((code - 65 + k) % 26) + 65);\n        } else {\n            res += c;\n        }\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    "All-convoYs-9-be:Alert1.",
                    4
                ],
                "expected": "Epp-gsrzsCw-9-fi:Epivx1.",
                "isHidden": false
            },
            {
                "args": [
                    "middle-Outz",
                    2
                ],
                "expected": "okffng-Qwvb",
                "isHidden": false
            }
        ]
    },
    {
        "id": "tcs-15",
        "company": "tcs",
        "category": "service",
        "number": 15,
        "title": "Numbers with Specific Digits 1, 4, 9",
        "difficulty": "Easy",
        "topic": "Digit Iteration",
        "frequency": "83% in TCS NQT",
        "context": "TCS Ninja filtering test",
        "fnName": "solve",
        "params": [
            {
                "name": "m",
                "type": "int"
            },
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Count how many numbers in range `[m, n]` consist strictly of the digits '1', '4', or '9' only.",
        "constraints": [
            "1 <= m <= n <= 10^5"
        ],
        "hint": "Check every number: all(d in {'1', '4', '9'} for d in str(num)).",
        "starter": {
            "python": "def solve(m, n):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(m, n) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(m, n):\n    valid = {'1', '4', '9'}\n    ans = 0\n    for x in range(m, n + 1):\n        if all(ch in valid for ch in str(x)):\n            ans += 1\n    return ans",
            "javascript": "function solve(m, n) {\n    let ans = 0;\n    for (let x = m; x <= n; x++) {\n        let s = String(x), ok = true;\n        for (let i = 0; i < s.length; i++) {\n            if (s[i] !== '1' && s[i] !== '4' && s[i] !== '9') { ok = false; break; }\n        }\n        if (ok) ans++;\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    1,
                    50
                ],
                "expected": 8,
                "isHidden": false
            },
            {
                "args": [
                    100,
                    200
                ],
                "expected": 9,
                "isHidden": false
            }
        ]
    },
    {
        "id": "tcs-16",
        "company": "tcs",
        "category": "service",
        "number": 16,
        "title": "Days in Month with Leap Year Check",
        "difficulty": "Easy",
        "topic": "Calendar Math",
        "frequency": "80% in TCS NQT",
        "context": "Payroll calendar service in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "month",
                "type": "int"
            },
            {
                "name": "year",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Return total days in given `month` (1-12) and `year`. If leap year, February has 29 days. (Leap year rule: divisible by 4 and (not divisible by 100 or divisible by 400)).",
        "constraints": [
            "1 <= month <= 12",
            "1 <= year <= 9999"
        ],
        "hint": "Leap year: (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0).",
        "starter": {
            "python": "def solve(month, year):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(month, year) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(month, year):\n    is_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\n    days = [31, 29 if is_leap else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]\n    return days[month - 1]",
            "javascript": "function solve(month, year) {\n    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);\n    const days = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];\n    return days[month - 1];\n}"
        },
        "testCases": [
            {
                "args": [
                    2,
                    2000
                ],
                "expected": 29,
                "isHidden": false
            },
            {
                "args": [
                    2,
                    1900
                ],
                "expected": 28,
                "isHidden": false
            },
            {
                "args": [
                    4,
                    2024
                ],
                "expected": 30,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-17",
        "company": "tcs",
        "category": "service",
        "number": 17,
        "title": "Find Array Equilibrium Index",
        "difficulty": "Easy",
        "topic": "Prefix Sum",
        "frequency": "88% in TCS NQT",
        "context": "Load balancing equilibrium in TCS NQT",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "An equilibrium index is an index where the sum of elements at lower indices equals sum at higher indices. Return the first equilibrium index (0-indexed). If none exists, return -1.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        "hint": "Total sum S. Maintain leftSum. At index i, rightSum = S - leftSum - nums[i].",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    total = sum(nums)\n    left = 0\n    for i, x in enumerate(nums):\n        if left == total - left - x:\n            return i\n        left += x\n    return -1",
            "javascript": "function solve(nums) {\n    const total = nums.reduce((a, b) => a + b, 0);\n    let left = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (left === total - left - nums[i]) return i;\n        left += nums[i];\n    }\n    return -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        -7,
                        1,
                        5,
                        2,
                        -4,
                        3,
                        0
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
                        3
                    ]
                ],
                "expected": -1,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1
                    ]
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-18",
        "company": "tcs",
        "category": "service",
        "number": 18,
        "title": "Trailing Zeroes in N Factorial",
        "difficulty": "Easy",
        "topic": "Math",
        "frequency": "90% in TCS NQT",
        "context": "TCS Ninja numeric aptitude",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given integer `n`, return the number of trailing zeroes in `n!`. Solve in O(log5 n) time.",
        "constraints": [
            "0 <= n <= 10^9"
        ],
        "hint": "Count factors of 5: count = n//5 + n//25 + n//125 + ...",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n):\n    count = 0\n    while n >= 5:\n        count += n // 5\n        n //= 5\n    return count",
            "javascript": "function solve(n) {\n    let count = 0;\n    while (n >= 5) {\n        count += Math.floor(n / 5);\n        n = Math.floor(n / 5);\n    }\n    return count;\n}"
        },
        "testCases": [
            {
                "args": [
                    5
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    25
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    100
                ],
                "expected": 24,
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-19",
        "company": "tcs",
        "category": "service",
        "number": 19,
        "title": "Remove Duplicate Characters Preserving Order",
        "difficulty": "Easy",
        "topic": "Strings & Sets",
        "frequency": "94% in TCS NQT",
        "context": "TCS NQT standard string cleanup",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given a string `s`, remove all duplicate characters, keeping only their first occurrence in the original order.",
        "constraints": [
            "1 <= s.length <= 10^5"
        ],
        "hint": "Use a Set to remember seen characters and append unseen characters to result.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return ''",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return '';\n}"
        },
        "solution": {
            "python": "def solve(s):\n    seen = set()\n    res = []\n    for c in s:\n        if c not in seen:\n            seen.add(c)\n            res.append(c)\n    return ''.join(res)",
            "javascript": "function solve(s) {\n    const seen = new Set();\n    let res = '';\n    for (const c of s) {\n        if (!seen.has(c)) {\n            seen.add(c);\n            res += c;\n        }\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    "programming"
                ],
                "expected": "progamin",
                "isHidden": false
            },
            {
                "args": [
                    "cbacdcbc"
                ],
                "expected": "cbad",
                "isHidden": false
            },
            {
                "args": [
                    "aaaaa"
                ],
                "expected": "a",
                "isHidden": true
            }
        ]
    },
    {
        "id": "tcs-20",
        "company": "tcs",
        "category": "service",
        "number": 20,
        "title": "Smallest Missing Positive Integer",
        "difficulty": "Medium",
        "topic": "Arrays & Cyclic Sort",
        "frequency": "89% in TCS Prime",
        "context": "Missing order ID detection in TCS Prime",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an unsorted integer array `nums`, return the smallest missing positive integer in O(n) time and O(1) auxiliary space.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-2^31 <= nums[i] <= 2^31 - 1"
        ],
        "hint": "Place number x at index x - 1 using cyclic swap, then find first mismatch.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    n = len(nums)\n    for i in range(n):\n        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n            target = nums[i] - 1\n            nums[i], nums[target] = nums[target], nums[i]\n    for i in range(n):\n        if nums[i] != i + 1:\n            return i + 1\n    return n + 1",
            "javascript": "function solve(nums) {\n    const n = nums.length;\n    for (let i = 0; i < n; i++) {\n        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {\n            const target = nums[i] - 1;\n            const tmp = nums[target];\n            nums[target] = nums[i];\n            nums[i] = tmp;\n        }\n    }\n    for (let i = 0; i < n; i++) {\n        if (nums[i] !== i + 1) return i + 1;\n    }\n    return n + 1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        0
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        3,
                        4,
                        -1,
                        1
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        7,
                        8,
                        9,
                        11,
                        12
                    ]
                ],
                "expected": 1,
                "isHidden": true
            }
        ]
    }
];
