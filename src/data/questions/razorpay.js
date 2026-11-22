export const RAZORPAY_QUESTIONS = [
    {
        "id": "raz-1",
        "company": "razorpay",
        "category": "startup",
        "number": 1,
        "title": "Luhn Algorithm Credit Card Number Checksum",
        "difficulty": "Easy",
        "topic": "Math & String Manipulation",
        "frequency": "98% in Razorpay Payments Core",
        "context": "Validating credit card PAN input before tokenization",
        "fnName": "solve",
        "params": [
            {
                "name": "cardNum",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Verify card validity using Luhn algorithm: double every second digit from right to left. If doubling > 9, subtract 9. Sum all digits. Valid if sum % 10 == 0.",
        "constraints": [
            "13 <= cardNum.length <= 19",
            "Contains only digits"
        ],
        "hint": "Iterate right-to-left. Double alternate digits, if d > 9 subtract 9. Check sum % 10 == 0.",
        "starter": {
            "python": "def solve(cardNum):\n    # Write your logic here\n    return False",
            "javascript": "function solve(cardNum) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(cardNum):\n    digits = [int(c) for c in cardNum]\n    checksum = 0\n    double = False\n    for d in reversed(digits):\n        if double:\n            d *= 2\n            if d > 9: d -= 9\n        checksum += d\n        double = not double\n    return checksum % 10 == 0",
            "javascript": "function solve(cardNum) {\n    let checksum = 0;\n    let double = false;\n    for (let i = cardNum.length - 1; i >= 0; i--) {\n        let d = parseInt(cardNum[i], 10);\n        if (double) {\n            d *= 2;\n            if (d > 9) d -= 9;\n        }\n        checksum += d;\n        double = !double;\n    }\n    return checksum % 10 === 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    "4532015112830366"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "4532015112830367"
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-2",
        "company": "razorpay",
        "category": "startup",
        "number": 2,
        "title": "Idempotent Payment Request Deduplication",
        "difficulty": "Medium",
        "topic": "Hash Map & Timestamps",
        "frequency": "96% in Razorpay API Gateway",
        "context": "Preventing double-charging customers during retry spikes",
        "fnName": "solve",
        "params": [
            {
                "name": "requests",
                "type": "string[][]"
            },
            {
                "name": "ttl",
                "type": "int"
            }
        ],
        "returnType": "string[]",
        "description": "Given payment requests `[idempotencyKey, timestamp]`. If a key was processed within `ttl` seconds (`currTime - prevTime <= ttl`), the duplicate is marked `DUPLICATE`. Otherwise process and mark `PROCESSED`. Return status array.",
        "constraints": [
            "1 <= requests.length <= 10^5"
        ],
        "hint": "Store last processed timestamp in a map for each key.",
        "starter": {
            "python": "def solve(requests, ttl):\n    # Write your logic here\n    return []",
            "javascript": "function solve(requests, ttl) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(requests, ttl):\n    seen = {}\n    res = []\n    for key, ts in requests:\n        t = int(ts)\n        if key in seen and t - seen[key] <= ttl:\n            res.append('DUPLICATE')\n        else:\n            seen[key] = t\n            res.append('PROCESSED')\n    return res",
            "javascript": "function solve(requests, ttl) {\n    const seen = new Map();\n    const res = [];\n    for (const [key, tsStr] of requests) {\n        const t = parseInt(tsStr, 10);\n        if (seen.has(key) && t - seen.get(key) <= ttl) {\n            res.push('DUPLICATE');\n        } else {\n            seen.set(key, t);\n            res.push('PROCESSED');\n        }\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            "req1",
                            "10"
                        ],
                        [
                            "req2",
                            "12"
                        ],
                        [
                            "req1",
                            "15"
                        ],
                        [
                            "req1",
                            "40"
                        ]
                    ],
                    20
                ],
                "expected": [
                    "PROCESSED",
                    "PROCESSED",
                    "DUPLICATE",
                    "PROCESSED"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-3",
        "company": "razorpay",
        "category": "startup",
        "number": 3,
        "title": "Webhook Retry Delivery with Exponential Backoff",
        "difficulty": "Easy",
        "topic": "Simulation & Math",
        "frequency": "95% in Razorpay Webhooks",
        "context": "Computing webhook retry dispatch schedule",
        "fnName": "solve",
        "params": [
            {
                "name": "baseDelay",
                "type": "int"
            },
            {
                "name": "maxRetries",
                "type": "int"
            },
            {
                "name": "maxDelay",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Calculate delays for retry attempts `1` to `maxRetries`. Delay for attempt `i` is `min(baseDelay * 2^(i - 1), maxDelay)`. Return array of delays.",
        "constraints": [
            "1 <= maxRetries <= 15",
            "baseDelay >= 1",
            "maxDelay >= baseDelay"
        ],
        "hint": "Formula: delay_i = min(baseDelay * (2 ** (i - 1)), maxDelay).",
        "starter": {
            "python": "def solve(baseDelay, maxRetries, maxDelay):\n    # Write your logic here\n    return []",
            "javascript": "function solve(baseDelay, maxRetries, maxDelay) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(baseDelay, maxRetries, maxDelay):\n    return [min(baseDelay * (2 ** i), maxDelay) for i in range(maxRetries)]",
            "javascript": "function solve(baseDelay, maxRetries, maxDelay) {\n    const res = [];\n    for (let i = 0; i < maxRetries; i++) {\n        res.push(Math.min(baseDelay * Math.pow(2, i), maxDelay));\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    2,
                    5,
                    20
                ],
                "expected": [
                    2,
                    4,
                    8,
                    16,
                    20
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-4",
        "company": "razorpay",
        "category": "startup",
        "number": 4,
        "title": "Payment Gateway Smart Routing by Success Rate",
        "difficulty": "Medium",
        "topic": "Greedy Ranking",
        "frequency": "93% in Razorpay Smart Router",
        "context": "Directing transactions to the highest converting bank gateway",
        "fnName": "solve",
        "params": [
            {
                "name": "gateways",
                "type": "string[]"
            },
            {
                "name": "successes",
                "type": "int[]"
            },
            {
                "name": "totals",
                "type": "int[]"
            }
        ],
        "returnType": "string",
        "description": "Choose the gateway with the highest success rate (`successes[i] / totals[i]`). If rates are equal, choose gateway with larger `successes[i]`. If still tied, choose lexicographically smaller gateway name.",
        "constraints": [
            "1 <= gateways.length <= 100",
            "totals[i] > 0"
        ],
        "hint": "Sort or pick best with composite key: (success/total, success, -gatewayName).",
        "starter": {
            "python": "def solve(gateways, successes, totals):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(gateways, successes, totals) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(gateways, successes, totals):\n    best_gw = None\n    best_key = (-1.0, -1, \"\")\n    for gw, s, t in zip(gateways, successes, totals):\n        rate = s / float(t)\n        key = (rate, s, gw)\n        if best_gw is None or (rate > best_key[0]) or (rate == best_key[0] and s > best_key[1]) or (rate == best_key[0] and s == best_key[1] and gw < best_key[2]):\n            best_gw = gw\n            best_key = key\n    return best_gw",
            "javascript": "function solve(gateways, successes, totals) {\n    let bestGw = gateways[0];\n    let bestRate = successes[0] / totals[0];\n    let bestSuccess = successes[0];\n    for (let i = 1; i < gateways.length; i++) {\n        const rate = successes[i] / totals[i];\n        if (rate > bestRate || (rate === bestRate && successes[i] > bestSuccess) || (rate === bestRate && successes[i] === bestSuccess && gateways[i] < bestGw)) {\n            bestGw = gateways[i];\n            bestRate = rate;\n            bestSuccess = successes[i];\n        }\n    }\n    return bestGw;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "HDFC",
                        "ICICI",
                        "AXIS"
                    ],
                    [
                        95,
                        96,
                        96
                    ],
                    [
                        100,
                        100,
                        100
                    ]
                ],
                "expected": "AXIS",
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-5",
        "company": "razorpay",
        "category": "startup",
        "number": 5,
        "title": "Merchant Tiered Transaction Fee (MDR)",
        "difficulty": "Easy",
        "topic": "Financial Computation",
        "frequency": "90% in Razorpay Billing",
        "context": "Calculating commission fees for business merchants",
        "fnName": "solve",
        "params": [
            {
                "name": "amount",
                "type": "int"
            },
            {
                "name": "paymentMethod",
                "type": "string"
            }
        ],
        "returnType": "float",
        "description": "Calculate MDR fee: For `UPI`, fee is 0.0 (free). For `DEBIT`, fee is 0.4% if amount <= 2000 else 0.9%. For `CREDIT`, fee is 1.8% plus flat 3 rupees. Return fee rounded to 2 decimal places.",
        "constraints": [
            "amount >= 1",
            "paymentMethod in ['UPI', 'DEBIT', 'CREDIT']"
        ],
        "hint": "Branch on paymentMethod and amount thresholds.",
        "starter": {
            "python": "def solve(amount, paymentMethod):\n    # Write your logic here\n    return 0.0",
            "javascript": "function solve(amount, paymentMethod) {\n    // Write your logic here\n    return 0.0;\n}"
        },
        "solution": {
            "python": "def solve(amount, paymentMethod):\n    if paymentMethod == 'UPI': return 0.0\n    elif paymentMethod == 'DEBIT':\n        pct = 0.004 if amount <= 2000 else 0.009\n        return round(amount * pct, 2)\n    elif paymentMethod == 'CREDIT':\n        return round(amount * 0.018 + 3.0, 2)\n    return 0.0",
            "javascript": "function solve(amount, paymentMethod) {\n    if (paymentMethod === 'UPI') return 0.0;\n    if (paymentMethod === 'DEBIT') {\n        const pct = amount <= 2000 ? 0.004 : 0.009;\n        return Math.round(amount * pct * 100) / 100;\n    }\n    if (paymentMethod === 'CREDIT') {\n        return Math.round((amount * 0.018 + 3) * 100) / 100;\n    }\n    return 0.0;\n}"
        },
        "testCases": [
            {
                "args": [
                    1500,
                    "DEBIT"
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    5000,
                    "CREDIT"
                ],
                "expected": 93,
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-6",
        "company": "razorpay",
        "category": "startup",
        "number": 6,
        "title": "Multi-Currency Forex Conversion with Cross-Rate",
        "difficulty": "Medium",
        "topic": "Graph Shortest Path / Product",
        "frequency": "91% in Razorpay International",
        "context": "Accepting USD/EUR and settling INR to Indian merchant",
        "fnName": "solve",
        "params": [
            {
                "name": "rates",
                "type": "string[][]"
            },
            {
                "name": "src",
                "type": "string"
            },
            {
                "name": "dest",
                "type": "string"
            },
            {
                "name": "amount",
                "type": "float"
            }
        ],
        "returnType": "float",
        "description": "Given exchange rates `[currFrom, currTo, rateStr]`. Find conversion value of `amount` from `src` to `dest`. Return converted amount rounded to 2 decimal places, or `-1.0` if no path exists.",
        "constraints": [
            "1 <= rates.length <= 50"
        ],
        "hint": "Graph BFS or DFS multiplying exchange rates along path.",
        "starter": {
            "python": "def solve(rates, src, dest, amount):\n    # Write your logic here\n    return -1.0",
            "javascript": "function solve(rates, src, dest, amount) {\n    // Write your logic here\n    return -1.0;\n}"
        },
        "solution": {
            "python": "def solve(rates, src, dest, amount):\n    from collections import defaultdict, deque\n    graph = defaultdict(dict)\n    for u, v, r in rates:\n        rate = float(r)\n        graph[u][v] = rate\n        graph[v][u] = 1.0 / rate\n    q = deque([(src, amount)])\n    visited = {src}\n    while q:\n        curr, curr_amt = q.popleft()\n        if curr == dest: return round(curr_amt, 2)\n        for neighbor, r in graph[curr].items():\n            if neighbor not in visited:\n                visited.add(neighbor)\n                q.append((neighbor, curr_amt * r))\n    return -1.0",
            "javascript": "function solve(rates, src, dest, amount) {\n    const graph = {};\n    for (const [u, v, r] of rates) {\n        const rate = parseFloat(r);\n        if (!graph[u]) graph[u] = {};\n        if (!graph[v]) graph[v] = {};\n        graph[u][v] = rate;\n        graph[v][u] = 1.0 / rate;\n    }\n    const q = [[src, amount]];\n    const visited = new Set([src]);\n    let head = 0;\n    while (head < q.length) {\n        const [curr, currAmt] = q[head++];\n        if (curr === dest) return Math.round(currAmt * 100) / 100;\n        for (const [neighbor, r] of Object.entries(graph[curr] || {})) {\n            if (!visited.has(neighbor)) {\n                visited.add(neighbor);\n                q.push([neighbor, currAmt * r]);\n            }\n        }\n    }\n    return -1.0;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            "USD",
                            "INR",
                            "83.0"
                        ],
                        [
                            "EUR",
                            "USD",
                            "1.10"
                        ]
                    ],
                    "EUR",
                    "INR",
                    100
                ],
                "expected": 9130,
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-7",
        "company": "razorpay",
        "category": "startup",
        "number": 7,
        "title": "Transaction Velocity Fraud Spike Detection",
        "difficulty": "Medium",
        "topic": "Sliding Window Queue",
        "frequency": "94% in Razorpay Thirdwatch",
        "context": "Flagging sudden bursts of micro-transactions on stolen credit cards",
        "fnName": "solve",
        "params": [
            {
                "name": "timestamps",
                "type": "int[]"
            },
            {
                "name": "windowSec",
                "type": "int"
            },
            {
                "name": "maxAllowed",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given sorted transaction arrival `timestamps`. Count how many transactions violate velocity limit: more than `maxAllowed` transactions occurred within the trailing `windowSec` window.",
        "constraints": [
            "1 <= timestamps.length <= 10^5"
        ],
        "hint": "Two pointers or deque tracking transactions within [t - windowSec, t].",
        "starter": {
            "python": "def solve(timestamps, windowSec, maxAllowed):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(timestamps, windowSec, maxAllowed) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(timestamps, windowSec, maxAllowed):\n    from collections import deque\n    dq = deque()\n    violations = 0\n    for t in timestamps:\n        dq.append(t)\n        while dq and dq[0] < t - windowSec:\n            dq.popleft()\n        if len(dq) > maxAllowed:\n            violations += 1\n    return violations",
            "javascript": "function solve(timestamps, windowSec, maxAllowed) {\n    const dq = [];\n    let violations = 0;\n    for (const t of timestamps) {\n        dq.push(t);\n        while (dq.length > 0 && dq[0] < t - windowSec) dq.shift();\n        if (dq.length > maxAllowed) violations++;\n    }\n    return violations;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        15,
                        20,
                        25,
                        30
                    ],
                    20,
                    3
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-8",
        "company": "razorpay",
        "category": "startup",
        "number": 8,
        "title": "UPI Virtual Payment Address (VPA) Validator",
        "difficulty": "Easy",
        "topic": "Regex & String Parsing",
        "frequency": "96% in Razorpay UPI Hub",
        "context": "Checking user VPA address format before issuing collect request",
        "fnName": "solve",
        "params": [
            {
                "name": "vpa",
                "type": "string"
            },
            {
                "name": "allowedProviders",
                "type": "string[]"
            }
        ],
        "returnType": "bool",
        "description": "A valid VPA format is `<username>@<provider>`. Username must contain only alphanumeric characters, dots, or hyphens (length 3 to 50). Provider must be in `allowedProviders`. Return `true` if valid.",
        "constraints": [
            "1 <= vpa.length <= 100"
        ],
        "hint": "Split by @. Verify username regex ^[a-zA-Z0-9.-]{3,50}$ and provider membership.",
        "starter": {
            "python": "def solve(vpa, allowedProviders):\n    # Write your logic here\n    return False",
            "javascript": "function solve(vpa, allowedProviders) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(vpa, allowedProviders):\n    import re\n    parts = vpa.split('@')\n    if len(parts) != 2: return False\n    user, prov = parts\n    if not re.match(r'^[a-zA-Z0-9.-]{3,50}$', user): return False\n    return prov.lower() in [p.lower() for p in allowedProviders]",
            "javascript": "function solve(vpa, allowedProviders) {\n    const parts = vpa.split('@');\n    if (parts.length !== 2) return false;\n    const [user, prov] = parts;\n    if (!/^[a-zA-Z0-9.-]{3,50}$/.test(user)) return false;\n    const set = new Set(allowedProviders.map(p => p.toLowerCase()));\n    return set.has(prov.toLowerCase());\n}"
        },
        "testCases": [
            {
                "args": [
                    "john.doe@okaxis",
                    [
                        "okaxis",
                        "oksbi",
                        "okhdfcbank"
                    ]
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "j@paytm",
                    [
                        "paytm"
                    ]
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-9",
        "company": "razorpay",
        "category": "startup",
        "number": 9,
        "title": "Subscription Recurring Billing Schedule Generator",
        "difficulty": "Medium",
        "topic": "Date & Interval Math",
        "frequency": "90% in Razorpay Subscriptions",
        "context": "Generating upcoming charge dates for SaaS subscriptions",
        "fnName": "solve",
        "params": [
            {
                "name": "startDay",
                "type": "int"
            },
            {
                "name": "cycleDays",
                "type": "int"
            },
            {
                "name": "totalCycles",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given `startDay`, return day numbers on which subscription billing occurs for `totalCycles` consecutive cycles (i.e. `startDay + i * cycleDays`).",
        "constraints": [
            "startDay >= 1",
            "cycleDays >= 1",
            "totalCycles >= 1"
        ],
        "hint": "Generate arithmetic progression.",
        "starter": {
            "python": "def solve(startDay, cycleDays, totalCycles):\n    # Write your logic here\n    return []",
            "javascript": "function solve(startDay, cycleDays, totalCycles) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(startDay, cycleDays, totalCycles):\n    return [startDay + i * cycleDays for i in range(totalCycles)]",
            "javascript": "function solve(startDay, cycleDays, totalCycles) {\n    const res = [];\n    for (let i = 0; i < totalCycles; i++) res.push(startDay + i * cycleDays);\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    1,
                    30,
                    4
                ],
                "expected": [
                    1,
                    31,
                    61,
                    91
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-10",
        "company": "razorpay",
        "category": "startup",
        "number": 10,
        "title": "Refund Ledger Debit-Credit Reconciliation",
        "difficulty": "Easy",
        "topic": "Hash Map & Sum",
        "frequency": "92% in Razorpay Reconcile",
        "context": "Ensuring net ledger balances zero between nodal accounts",
        "fnName": "solve",
        "params": [
            {
                "name": "entries",
                "type": "int[][]"
            }
        ],
        "returnType": "bool",
        "description": "Each ledger entry is `[accountId, amount]` (positive for CREDIT, negative for DEBIT). Return `true` if net ledger balances across all entries sum to exactly `0`.",
        "constraints": [
            "1 <= entries.length <= 10^5"
        ],
        "hint": "Sum all amounts in entries. If total sum == 0 return true.",
        "starter": {
            "python": "def solve(entries):\n    # Write your logic here\n    return False",
            "javascript": "function solve(entries) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(entries):\n    return sum(amt for _, amt in entries) == 0",
            "javascript": "function solve(entries) {\n    return entries.reduce((acc, [, amt]) => acc + amt, 0) === 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            500
                        ],
                        [
                            2,
                            -300
                        ],
                        [
                            3,
                            -200
                        ]
                    ]
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            1,
                            500
                        ],
                        [
                            2,
                            -200
                        ]
                    ]
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-11",
        "company": "razorpay",
        "category": "startup",
        "number": 11,
        "title": "Rolling Settlement Reserve Holdback",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "frequency": "89% in Razorpay Settlements",
        "context": "Holding 10% rolling reserve for high chargeback risk merchants",
        "fnName": "solve",
        "params": [
            {
                "name": "dailySettlements",
                "type": "int[]"
            },
            {
                "name": "holdbackPct",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given `dailySettlements` array. Each day, merchant receives `dailySettlements[i] * (100 - holdbackPct) / 100` net payout. Return array of daily merchant payouts (rounded down).",
        "constraints": [
            "1 <= dailySettlements.length <= 1000",
            "0 <= holdbackPct <= 100"
        ],
        "hint": "Math: floor(amount * (100 - pct) / 100).",
        "starter": {
            "python": "def solve(dailySettlements, holdbackPct):\n    # Write your logic here\n    return []",
            "javascript": "function solve(dailySettlements, holdbackPct) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(dailySettlements, holdbackPct):\n    return [int(s * (100 - holdbackPct) // 100) for s in dailySettlements]",
            "javascript": "function solve(dailySettlements, holdbackPct) {\n    return dailySettlements.map(s => Math.floor(s * (100 - holdbackPct) / 100));\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10000,
                        25000,
                        40000
                    ],
                    10
                ],
                "expected": [
                    9000,
                    22500,
                    36000
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-12",
        "company": "razorpay",
        "category": "startup",
        "number": 12,
        "title": "API Rate Limiter Sliding Window Log",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "frequency": "95% in Razorpay Developer API",
        "context": "Protecting public developer API endpoints from quota exhaustion",
        "fnName": "solve",
        "params": [
            {
                "name": "requests",
                "type": "int[]"
            },
            {
                "name": "maxReq",
                "type": "int"
            },
            {
                "name": "windowSec",
                "type": "int"
            }
        ],
        "returnType": "bool[]",
        "description": "Given arrival timestamps of API calls. For each call, check if number of requests in previous `windowSec` (i.e. `[timestamp - windowSec + 1, timestamp]`) is strictly `<= maxReq`. Return array of booleans indicating if call was accepted.",
        "constraints": [
            "1 <= requests.length <= 10^5"
        ],
        "hint": "Maintain sliding window of timestamps.",
        "starter": {
            "python": "def solve(requests, maxReq, windowSec):\n    # Write your logic here\n    return []",
            "javascript": "function solve(requests, maxReq, windowSec) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(requests, maxReq, windowSec):\n    from collections import deque\n    dq = deque()\n    res = []\n    for t in requests:\n        while dq and dq[0] <= t - windowSec:\n            dq.popleft()\n        if len(dq) < maxReq:\n            dq.append(t)\n            res.append(True)\n        else:\n            res.append(False)\n    return res",
            "javascript": "function solve(requests, maxReq, windowSec) {\n    const dq = [];\n    const res = [];\n    for (const t of requests) {\n        while (dq.length > 0 && dq[0] <= t - windowSec) dq.shift();\n        if (dq.length < maxReq) {\n            dq.push(t);\n            res.push(true);\n        } else {\n            res.push(false);\n        }\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        5
                    ],
                    3,
                    5
                ],
                "expected": [
                    true,
                    true,
                    true,
                    false
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-13",
        "company": "razorpay",
        "category": "startup",
        "number": 13,
        "title": "Virtual Account Prefix Routing Dispatcher",
        "difficulty": "Medium",
        "topic": "Trie & Prefix Matching",
        "frequency": "90% in Razorpay Banking",
        "context": "Routing bank NEFT transfers to merchant sub-accounts",
        "fnName": "solve",
        "params": [
            {
                "name": "accountNum",
                "type": "string"
            },
            {
                "name": "prefixMerchantMap",
                "type": "string[][]"
            }
        ],
        "returnType": "string",
        "description": "Given a virtual account number and prefixes `[prefix, merchantName]`. Match account number against prefixes and return the merchantName of the LONGEST matching prefix. Return `UNKNOWN` if none match.",
        "constraints": [
            "1 <= accountNum.length <= 20",
            "1 <= prefixMerchantMap.length <= 100"
        ],
        "hint": "Sort prefixes by length descending or build prefix Trie.",
        "starter": {
            "python": "def solve(accountNum, prefixMerchantMap):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(accountNum, prefixMerchantMap) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(accountNum, prefixMerchantMap):\n    matches = [m for p, m in prefixMerchantMap if accountNum.startswith(p)]\n    if not matches: return 'UNKNOWN'\n    prefixMerchantMap.sort(key=lambda x: len(x[0]), reverse=True)\n    for p, m in prefixMerchantMap:\n        if accountNum.startswith(p): return m\n    return 'UNKNOWN'",
            "javascript": "function solve(accountNum, prefixMerchantMap) {\n    const sorted = [...prefixMerchantMap].sort((a, b) => b[0].length - a[0].length);\n    for (const [p, m] of sorted) {\n        if (accountNum.startsWith(p)) return m;\n    }\n    return 'UNKNOWN';\n}"
        },
        "testCases": [
            {
                "args": [
                    "RZPYHDFC10023",
                    [
                        [
                            "RZPY",
                            "Generic"
                        ],
                        [
                            "RZPYHDFC",
                            "HDFC_Merchant"
                        ],
                        [
                            "RZPYICIC",
                            "ICICI_Merchant"
                        ]
                    ]
                ],
                "expected": "HDFC_Merchant",
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-14",
        "company": "razorpay",
        "category": "startup",
        "number": 14,
        "title": "Bank IFSC Code Branch District Parser",
        "difficulty": "Easy",
        "topic": "String Parsing",
        "frequency": "93% in Razorpay Payouts",
        "context": "Validating Indian Financial System Code format (4 letters + '0' + 6 alphanumeric)",
        "fnName": "solve",
        "params": [
            {
                "name": "ifsc",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Verify IFSC code: exactly 11 characters. First 4 characters must be uppercase letters. 5th character must be '0'. Last 6 characters must be alphanumeric.",
        "constraints": [
            "ifsc is non-empty"
        ],
        "hint": "Length 11, ifsc[4] == '0', regex ^[A-Z]{4}0[A-Z0-9]{6}$.",
        "starter": {
            "python": "def solve(ifsc):\n    # Write your logic here\n    return False",
            "javascript": "function solve(ifsc) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(ifsc):\n    import re\n    return bool(re.match(r'^[A-Z]{4}0[A-Z0-9]{6}$', ifsc))",
            "javascript": "function solve(ifsc) {\n    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);\n}"
        },
        "testCases": [
            {
                "args": [
                    "HDFC0000240"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "SBIN1002345"
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-15",
        "company": "razorpay",
        "category": "startup",
        "number": 15,
        "title": "Instant Payout IMPS vs NEFT Fee Optimization",
        "difficulty": "Easy",
        "topic": "Conditional Logic",
        "frequency": "89% in Razorpay Payouts",
        "context": "Choosing cheapest instant payout rail",
        "fnName": "solve",
        "params": [
            {
                "name": "amount",
                "type": "int"
            },
            {
                "name": "isInstantNeeded",
                "type": "bool"
            }
        ],
        "returnType": "string",
        "description": "Payout rules: If `isInstantNeeded == false`, use `NEFT` (flat 3 rupees). If `isInstantNeeded == true`: for amount <= 1000, `UPI` (1 rupee); for 1001 to 200000, `IMPS` (5 rupees); above 200000, `RTGS` (15 rupees). Return chosen rail string.",
        "constraints": [
            "amount >= 1"
        ],
        "hint": "Branch on isInstantNeeded, then amount thresholds.",
        "starter": {
            "python": "def solve(amount, isInstantNeeded):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(amount, isInstantNeeded) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(amount, isInstantNeeded):\n    if not isInstantNeeded: return 'NEFT'\n    if amount <= 1000: return 'UPI'\n    if amount <= 200000: return 'IMPS'\n    return 'RTGS'",
            "javascript": "function solve(amount, isInstantNeeded) {\n    if (!isInstantNeeded) return 'NEFT';\n    if (amount <= 1000) return 'UPI';\n    if (amount <= 200000) return 'IMPS';\n    return 'RTGS';\n}"
        },
        "testCases": [
            {
                "args": [
                    500,
                    true
                ],
                "expected": "UPI",
                "isHidden": false
            },
            {
                "args": [
                    50000,
                    false
                ],
                "expected": "NEFT",
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-16",
        "company": "razorpay",
        "category": "startup",
        "number": 16,
        "title": "Dispute Chargeback Evidence Expiry Priority Queue",
        "difficulty": "Medium",
        "topic": "Priority Queue",
        "frequency": "91% in Razorpay Disputes",
        "context": "Filing defense representation before bank deadline",
        "fnName": "solve",
        "params": [
            {
                "name": "disputes",
                "type": "int[][]"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given `disputes[i] = [disputeId, amount, hoursRemaining]`. Higher urgency: fewer `hoursRemaining`. Tie breaker: larger `amount`. Return dispute IDs of top `k` most urgent disputes to defend.",
        "constraints": [
            "1 <= k <= disputes.length <= 10^5"
        ],
        "hint": "Sort key: (hoursRemaining, -amount). Take first k IDs.",
        "starter": {
            "python": "def solve(disputes, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(disputes, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(disputes, k):\n    disputes.sort(key=lambda x: (x[2], -x[1]))\n    return [d[0] for d in disputes[:k]]",
            "javascript": "function solve(disputes, k) {\n    const sorted = [...disputes].sort((a, b) => {\n        if (a[2] !== b[2]) return a[2] - b[2];\n        return b[1] - a[1];\n    });\n    return sorted.slice(0, k).map(d => d[0]);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            101,
                            5000,
                            24
                        ],
                        [
                            102,
                            10000,
                            12
                        ],
                        [
                            103,
                            12000,
                            12
                        ]
                    ],
                    2
                ],
                "expected": [
                    103,
                    102
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-17",
        "company": "razorpay",
        "category": "startup",
        "number": 17,
        "title": "Tokenized Card Vault Hash Lookup",
        "difficulty": "Easy",
        "topic": "Hash Map",
        "frequency": "90% in Razorpay TokenHQ",
        "context": "RBI Card-on-File Tokenization (CoFT)",
        "fnName": "solve",
        "params": [
            {
                "name": "cardFingerprint",
                "type": "string"
            },
            {
                "name": "vaultRecords",
                "type": "string[][]"
            }
        ],
        "returnType": "string",
        "description": "Given `vaultRecords[i] = [fingerprint, token, status]`. Return `token` if fingerprint matches and status is `ACTIVE`. If status is `SUSPENDED` or not found, return `NOT_FOUND`.",
        "constraints": [
            "1 <= vaultRecords.length <= 10^4"
        ],
        "hint": "Iterate vault records or load active records into hash map.",
        "starter": {
            "python": "def solve(cardFingerprint, vaultRecords):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(cardFingerprint, vaultRecords) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(cardFingerprint, vaultRecords):\n    for fp, tok, st in vaultRecords:\n        if fp == cardFingerprint and st == 'ACTIVE': return tok\n    return 'NOT_FOUND'",
            "javascript": "function solve(cardFingerprint, vaultRecords) {\n    for (const [fp, tok, st] of vaultRecords) {\n        if (fp === cardFingerprint && st === 'ACTIVE') return tok;\n    }\n    return 'NOT_FOUND';\n}"
        },
        "testCases": [
            {
                "args": [
                    "fp_abc123",
                    [
                        [
                            "fp_abc123",
                            "tok_9999",
                            "ACTIVE"
                        ],
                        [
                            "fp_def456",
                            "tok_8888",
                            "SUSPENDED"
                        ]
                    ]
                ],
                "expected": "tok_9999",
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-18",
        "company": "razorpay",
        "category": "startup",
        "number": 18,
        "title": "Dynamic QR Code CRC-16 Checksum Generator",
        "difficulty": "Medium",
        "topic": "Bitwise Manipulation",
        "frequency": "88% in Razorpay POS QR",
        "context": "BharatQR / UPI QR payload integrity code",
        "fnName": "solve",
        "params": [
            {
                "name": "payload",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Calculate standard CRC-16 (polynomial `0x1021`, initial `0xFFFF`) of `payload`. Return 4-character uppercase hexadecimal string of checksum.",
        "constraints": [
            "1 <= payload.length <= 1000"
        ],
        "hint": "Bitwise CRC-16 loop over char codes.",
        "starter": {
            "python": "def solve(payload):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(payload) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(payload):\n    crc = 0xFFFF\n    for char in payload:\n        crc ^= (ord(char) << 8)\n        for _ in range(8):\n            if (crc & 0x8000):\n                crc = ((crc << 1) ^ 0x1021) & 0xFFFF\n            else:\n                crc = (crc << 1) & 0xFFFF\n    return f\"{crc:04X}\"",
            "javascript": "function solve(payload) {\n    let crc = 0xFFFF;\n    for (let i = 0; i < payload.length; i++) {\n        crc ^= (payload.charCodeAt(i) << 8);\n        for (let j = 0; j < 8; j++) {\n            if ((crc & 0x8000) !== 0) {\n                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;\n            } else {\n                crc = (crc << 1) & 0xFFFF;\n            }\n        }\n    }\n    return crc.toString(16).toUpperCase().padStart(4, '0');\n}"
        },
        "testCases": [
            {
                "args": [
                    "upi://pay?pa=merchant@razorpay"
                ],
                "expected": "55C8",
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-19",
        "company": "razorpay",
        "category": "startup",
        "number": 19,
        "title": "Payment Link Lifetime Expiration State Machine",
        "difficulty": "Easy",
        "topic": "Conditionals",
        "frequency": "90% in Razorpay Payment Links",
        "context": "Payment link checkout validation",
        "fnName": "solve",
        "params": [
            {
                "name": "createdAt",
                "type": "int"
            },
            {
                "name": "expireBy",
                "type": "int"
            },
            {
                "name": "attemptTime",
                "type": "int"
            },
            {
                "name": "isPaid",
                "type": "bool"
            }
        ],
        "returnType": "string",
        "description": "Determine payment link status: If `isPaid == true`, return `PAID`. Else if `attemptTime > expireBy`, return `EXPIRED`. Otherwise return `ACTIVE`.",
        "constraints": [
            "createdAt < expireBy"
        ],
        "hint": "Check isPaid first, then compare attemptTime with expireBy.",
        "starter": {
            "python": "def solve(createdAt, expireBy, attemptTime, isPaid):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(createdAt, expireBy, attemptTime, isPaid) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(createdAt, expireBy, attemptTime, isPaid):\n    if isPaid: return 'PAID'\n    if attemptTime > expireBy: return 'EXPIRED'\n    return 'ACTIVE'",
            "javascript": "function solve(createdAt, expireBy, attemptTime, isPaid) {\n    if (isPaid) return 'PAID';\n    if (attemptTime > expireBy) return 'EXPIRED';\n    return 'ACTIVE';\n}"
        },
        "testCases": [
            {
                "args": [
                    100,
                    200,
                    150,
                    false
                ],
                "expected": "ACTIVE",
                "isHidden": false
            },
            {
                "args": [
                    100,
                    200,
                    250,
                    false
                ],
                "expected": "EXPIRED",
                "isHidden": false
            }
        ]
    },
    {
        "id": "raz-20",
        "company": "razorpay",
        "category": "startup",
        "number": 20,
        "title": "Split Payment Settlement to Multi-Vendor Sub-Accounts",
        "difficulty": "Medium",
        "topic": "Math & Greedy Allocation",
        "frequency": "94% in Razorpay Route",
        "context": "Marketplace split payment to vendors",
        "fnName": "solve",
        "params": [
            {
                "name": "totalAmount",
                "type": "int"
            },
            {
                "name": "shares",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given `totalAmount` in rupees and integer vendor percentage `shares` that sum to 100. Calculate integer settlement amounts for each vendor: `floor(totalAmount * share / 100)`. Any leftover paise due to rounding goes to vendor 0.",
        "constraints": [
            "1 <= shares.length <= 100",
            "sum(shares) == 100"
        ],
        "hint": "Compute floor share for all, sum them, add difference to index 0.",
        "starter": {
            "python": "def solve(totalAmount, shares):\n    # Write your logic here\n    return []",
            "javascript": "function solve(totalAmount, shares) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(totalAmount, shares):\n    payouts = [totalAmount * s // 100 for s in shares]\n    diff = totalAmount - sum(payouts)\n    payouts[0] += diff\n    return payouts",
            "javascript": "function solve(totalAmount, shares) {\n    const payouts = shares.map(s => Math.floor((totalAmount * s) / 100));\n    const diff = totalAmount - payouts.reduce((a, b) => a + b, 0);\n    payouts[0] += diff;\n    return payouts;\n}"
        },
        "testCases": [
            {
                "args": [
                    1000,
                    [
                        50,
                        30,
                        20
                    ]
                ],
                "expected": [
                    500,
                    300,
                    200
                ],
                "isHidden": false
            },
            {
                "args": [
                    100,
                    [
                        33,
                        33,
                        34
                    ]
                ],
                "expected": [
                    34,
                    33,
                    34
                ],
                "isHidden": false
            }
        ]
    }
];
