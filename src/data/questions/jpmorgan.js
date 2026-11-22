export const JPMORGAN_QUESTIONS = [
    {
        "id": "jpm-1",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 1,
        "title": "ATM Currency Cassette Dispense",
        "difficulty": "Medium",
        "topic": "Greedy & DP Coin Change",
        "frequency": "97% in JPMorgan Chase Core",
        "context": "ATM hardware cassette note dispensing logic",
        "fnName": "solve",
        "params": [
            {
                "name": "denominations",
                "type": "int[]"
            },
            {
                "name": "cassetteCounts",
                "type": "int[]"
            },
            {
                "name": "amount",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "An ATM has notes in `denominations` (e.g. [2000, 500, 200, 100]) with available note counts in `cassetteCounts`. Dispense `amount` using minimum total notes. Return array of notes dispensed per denomination, or `[]` if exact amount cannot be dispensed.",
        "constraints": [
            "denominations.length == cassetteCounts.length",
            "amount >= 0"
        ],
        "hint": "Greedy choice from highest to lowest denomination while respecting cassette capacity.",
        "starter": {
            "python": "def solve(denominations, cassetteCounts, amount):\n    # Write your logic here\n    return []",
            "javascript": "function solve(denominations, cassetteCounts, amount) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(denominations, cassetteCounts, amount):\n    dispensed = [0] * len(denominations)\n    rem = amount\n    for i in range(len(denominations)):\n        d = denominations[i]\n        c = cassetteCounts[i]\n        take = min(rem // d, c)\n        dispensed[i] = take\n        rem -= take * d\n    return dispensed if rem == 0 else []",
            "javascript": "function solve(denominations, cassetteCounts, amount) {\n    const dispensed = new Array(denominations.length).fill(0);\n    let rem = amount;\n    for (let i = 0; i < denominations.length; i++) {\n        const d = denominations[i], c = cassetteCounts[i];\n        const take = Math.min(Math.floor(rem / d), c);\n        dispensed[i] = take;\n        rem -= take * d;\n    }\n    return rem === 0 ? dispensed : [];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2000,
                        500,
                        200,
                        100
                    ],
                    [
                        5,
                        10,
                        10,
                        20
                    ],
                    3700
                ],
                "expected": [
                    1,
                    3,
                    1,
                    0
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        500,
                        200
                    ],
                    [
                        1,
                        1
                    ],
                    800
                ],
                "expected": [],
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-2",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 2,
        "title": "Optimal Cash Flow Debt Settlement",
        "difficulty": "Hard",
        "topic": "Recursion & Backtracking",
        "frequency": "95% in JPMorgan Tech",
        "context": "Net settlement optimization across correspondent banks",
        "fnName": "solve",
        "params": [
            {
                "name": "transactions",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given `transactions[i] = [from, to, amount]`. Settle all debts using minimum number of transfer transactions between individuals.",
        "constraints": [
            "1 <= transactions.length <= 1000",
            "Persons <= 12"
        ],
        "hint": "Calculate net balance for each person. Filter non-zero balances and use backtracking to match positive and negative debts.",
        "starter": {
            "python": "def solve(transactions):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(transactions) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(transactions):\n    from collections import defaultdict\n    bal = defaultdict(int)\n    for u, v, amt in transactions:\n        bal[u] -= amt\n        bal[v] += amt\n    debts = [x for x in bal.values() if x != 0]\n    def dfs(start):\n        while start < len(debts) and debts[start] == 0: start += 1\n        if start == len(debts): return 0\n        min_tx = float('inf')\n        for i in range(start + 1, len(debts)):\n            if debts[start] * debts[i] < 0:\n                debts[i] += debts[start]\n                min_tx = min(min_tx, 1 + dfs(start + 1))\n                debts[i] -= debts[start]\n        return min_tx if min_tx != float('inf') else 0\n    return dfs(0)",
            "javascript": "function solve(transactions) {\n    const bal = {};\n    for (const [u, v, amt] of transactions) {\n        bal[u] = (bal[u] || 0) - amt;\n        bal[v] = (bal[v] || 0) + amt;\n    }\n    const debts = Object.values(bal).filter(x => x !== 0);\n    const dfs = (start) => {\n        while (start < debts.length && debts[start] === 0) start++;\n        if (start === debts.length) return 0;\n        let minTx = Infinity;\n        for (let i = start + 1; i < debts.length; i++) {\n            if (debts[start] * debts[i] < 0) {\n                debts[i] += debts[start];\n                minTx = Math.min(minTx, 1 + dfs(start + 1));\n                debts[i] -= debts[start];\n            }\n        }\n        return minTx === Infinity ? 0 : minTx;\n    };\n    return dfs(0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            0,
                            1,
                            10
                        ],
                        [
                            2,
                            0,
                            5
                        ]
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            0,
                            1,
                            10
                        ],
                        [
                            1,
                            0,
                            10
                        ]
                    ]
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-3",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 3,
        "title": "Compound Interest Annuity Growth",
        "difficulty": "Easy",
        "topic": "Financial Math",
        "frequency": "92% in JPMorgan Asset Management",
        "context": "Retirement corpus projection",
        "fnName": "solve",
        "params": [
            {
                "name": "principal",
                "type": "float"
            },
            {
                "name": "annualRatePct",
                "type": "float"
            },
            {
                "name": "years",
                "type": "int"
            },
            {
                "name": "annualContribution",
                "type": "float"
            }
        ],
        "returnType": "float",
        "description": "Given starting `principal`, `annualRatePct` (e.g. 8.0 for 8%), duration in `years`, and an `annualContribution` deposited at end of each year. Compute final portfolio value rounded to 2 decimal places.",
        "constraints": [
            "principal >= 0",
            "annualRatePct >= 0",
            "years >= 1"
        ],
        "hint": "Iterate year-by-year: balance = balance * (1 + r) + contribution.",
        "starter": {
            "python": "def solve(principal, annualRatePct, years, annualContribution):\n    # Write your logic here\n    return 0.0",
            "javascript": "function solve(principal, annualRatePct, years, annualContribution) {\n    // Write your logic here\n    return 0.0;\n}"
        },
        "solution": {
            "python": "def solve(principal, annualRatePct, years, annualContribution):\n    r = annualRatePct / 100.0\n    curr = principal\n    for _ in range(years):\n        curr = curr * (1.0 + r) + annualContribution\n    return round(float(curr), 2)",
            "javascript": "function solve(principal, annualRatePct, years, annualContribution) {\n    const r = annualRatePct / 100;\n    let curr = principal;\n    for (let i = 0; i < years; i++) {\n        curr = curr * (1 + r) + annualContribution;\n    }\n    return Math.round(curr * 100) / 100;\n}"
        },
        "testCases": [
            {
                "args": [
                    10000,
                    10,
                    2,
                    5000
                ],
                "expected": 17600,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-4",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 4,
        "title": "Credit Score Tier & Interest Rate Lookup",
        "difficulty": "Easy",
        "topic": "Conditional Logic",
        "frequency": "90% in JPMorgan Retail Banking",
        "context": "Automated underwriting tiering",
        "fnName": "solve",
        "params": [
            {
                "name": "cibilScore",
                "type": "int"
            },
            {
                "name": "loanAmount",
                "type": "int"
            }
        ],
        "returnType": "float",
        "description": "If `cibilScore >= 800`, rate is 7.5%. If `750 <= cibilScore < 800`, rate is 8.5%. If `700 <= cibilScore < 750`, rate is 9.5%. If `< 700`, loan is rejected (return `-1.0`). If approved, return first year interest = `loanAmount * (rate / 100)` rounded to 2 decimal places.",
        "constraints": [
            "300 <= cibilScore <= 900",
            "loanAmount > 0"
        ],
        "hint": "Branch on cibilScore ranges.",
        "starter": {
            "python": "def solve(cibilScore, loanAmount):\n    # Write your logic here\n    return -1.0",
            "javascript": "function solve(cibilScore, loanAmount) {\n    // Write your logic here\n    return -1.0;\n}"
        },
        "solution": {
            "python": "def solve(cibilScore, loanAmount):\n    if cibilScore >= 800: rate = 7.5\n    elif cibilScore >= 750: rate = 8.5\n    elif cibilScore >= 700: rate = 9.5\n    else: return -1.0\n    return round(loanAmount * (rate / 100.0), 2)",
            "javascript": "function solve(cibilScore, loanAmount) {\n    let rate = 0;\n    if (cibilScore >= 800) rate = 7.5;\n    else if (cibilScore >= 750) rate = 8.5;\n    else if (cibilScore >= 700) rate = 9.5;\n    else return -1.0;\n    return Math.round(loanAmount * (rate / 100) * 100) / 100;\n}"
        },
        "testCases": [
            {
                "args": [
                    820,
                    1000000
                ],
                "expected": 75000,
                "isHidden": false
            },
            {
                "args": [
                    650,
                    500000
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-5",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 5,
        "title": "Mortgage Amortization Month-1 Split",
        "difficulty": "Medium",
        "topic": "Financial Mathematics",
        "frequency": "93% in JPMorgan Mortgages",
        "context": "EMI breakdown into interest and principal reduction",
        "fnName": "solve",
        "params": [
            {
                "name": "principal",
                "type": "float"
            },
            {
                "name": "annualInterestPct",
                "type": "float"
            },
            {
                "name": "tenureMonths",
                "type": "int"
            }
        ],
        "returnType": "float[]",
        "description": "Calculate standard monthly EMI using `EMI = P * r * (1+r)^N / ((1+r)^N - 1)` where `r = annualInterestPct / 12 / 100`. Then return `[round(EMI, 2), round(firstMonthInterest, 2), round(firstMonthPrincipal, 2)]`.",
        "constraints": [
            "principal > 0",
            "annualInterestPct > 0",
            "tenureMonths >= 1"
        ],
        "hint": "First month interest = P * r. First month principal = EMI - firstMonthInterest.",
        "starter": {
            "python": "def solve(principal, annualInterestPct, tenureMonths):\n    # Write your logic here\n    return []",
            "javascript": "function solve(principal, annualInterestPct, tenureMonths) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(principal, annualInterestPct, tenureMonths):\n    r = annualInterestPct / 12.0 / 100.0\n    num = principal * r * ((1.0 + r) ** tenureMonths)\n    den = ((1.0 + r) ** tenureMonths) - 1.0\n    emi = num / den\n    interest1 = principal * r\n    principal1 = emi - interest1\n    return [round(emi, 2), round(interest1, 2), round(principal1, 2)]",
            "javascript": "function solve(principal, annualInterestPct, tenureMonths) {\n    const r = annualInterestPct / 12 / 100;\n    const factor = Math.pow(1 + r, tenureMonths);\n    const emi = (principal * r * factor) / (factor - 1);\n    const interest1 = principal * r;\n    const principal1 = emi - interest1;\n    return [Math.round(emi * 100) / 100, Math.round(interest1 * 100) / 100, Math.round(principal1 * 100) / 100];\n}"
        },
        "testCases": [
            {
                "args": [
                    100000,
                    12,
                    12
                ],
                "expected": [
                    8884.88,
                    1000,
                    7884.88
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-6",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 6,
        "title": "HNW Client Portfolio Rebalancing Adjustments",
        "difficulty": "Medium",
        "topic": "Vector Math",
        "frequency": "91% in JPMorgan Private Bank",
        "context": "Realigning asset weights back to target benchmarks",
        "fnName": "solve",
        "params": [
            {
                "name": "currentValues",
                "type": "int[]"
            },
            {
                "name": "targetPct",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given current values in `n` asset classes and target percentages `targetPct` summing to 100. Total portfolio is sum of current values. Compute net adjustment (target - current) for each asset class (rounded to nearest integer). Positive means BUY, negative means SELL.",
        "constraints": [
            "currentValues.length == targetPct.length",
            "sum(targetPct) == 100"
        ],
        "hint": "target_val = total * targetPct / 100. adjustment = round(target_val - current).",
        "starter": {
            "python": "def solve(currentValues, targetPct):\n    # Write your logic here\n    return []",
            "javascript": "function solve(currentValues, targetPct) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(currentValues, targetPct):\n    total = sum(currentValues)\n    return [round(total * pct / 100.0) - curr for curr, pct in zip(currentValues, targetPct)]",
            "javascript": "function solve(currentValues, targetPct) {\n    const total = currentValues.reduce((a, b) => a + b, 0);\n    return currentValues.map((curr, i) => Math.round((total * targetPct[i]) / 100) - curr);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        60000,
                        40000
                    ],
                    [
                        50,
                        50
                    ]
                ],
                "expected": [
                    -10000,
                    10000
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-7",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 7,
        "title": "Double-Entry Invariant Ledger Auditor",
        "difficulty": "Easy",
        "topic": "Hash Map Accumulation",
        "frequency": "94% in JPMorgan Core Banking",
        "context": "Accounting balance sheet audit validation",
        "fnName": "solve",
        "params": [
            {
                "name": "journalEntries",
                "type": "int[][]"
            }
        ],
        "returnType": "bool",
        "description": "Each entry is `[journalId, accountId, debit, credit]`. For each unique `journalId`, total debit must equal total credit. Return `true` if all journal entries are balanced.",
        "constraints": [
            "1 <= journalEntries.length <= 10^5"
        ],
        "hint": "Accumulate (debit - credit) per journalId in a map. All must be 0.",
        "starter": {
            "python": "def solve(journalEntries):\n    # Write your logic here\n    return False",
            "javascript": "function solve(journalEntries) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(journalEntries):\n    from collections import defaultdict\n    diffs = defaultdict(int)\n    for jid, _, debit, credit in journalEntries:\n        diffs[jid] += (debit - credit)\n    return all(v == 0 for v in diffs.values())",
            "javascript": "function solve(journalEntries) {\n    const diffs = {};\n    for (const [jid, , debit, credit] of journalEntries) {\n        diffs[jid] = (diffs[jid] || 0) + (debit - credit);\n    }\n    return Object.values(diffs).every(v => v === 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            101,
                            500,
                            0
                        ],
                        [
                            1,
                            102,
                            0,
                            500
                        ],
                        [
                            2,
                            103,
                            200,
                            0
                        ],
                        [
                            2,
                            104,
                            0,
                            200
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
                            101,
                            500,
                            0
                        ],
                        [
                            1,
                            102,
                            0,
                            400
                        ]
                    ]
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-8",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 8,
        "title": "Circular Money Laundering Network Detection",
        "difficulty": "Medium",
        "topic": "Graph Cycle Detection (DFS)",
        "frequency": "96% in JPMorgan AML Compliance",
        "context": "Anti-Money Laundering (AML) suspicious layering ring detection",
        "fnName": "solve",
        "params": [
            {
                "name": "numAccounts",
                "type": "int"
            },
            {
                "name": "transfers",
                "type": "int[][]"
            }
        ],
        "returnType": "bool",
        "description": "Given accounts `0` to `numAccounts - 1` and fund transfers `[src, dest]`. Detect if there exists a circular transfer cycle (money flowing back to the initiator). Return `true` if cycle exists.",
        "constraints": [
            "1 <= numAccounts <= 2000",
            "0 <= transfers.length <= 10^4"
        ],
        "hint": "Three-color DFS cycle detection (white=0, gray=1, black=2).",
        "starter": {
            "python": "def solve(numAccounts, transfers):\n    # Write your logic here\n    return False",
            "javascript": "function solve(numAccounts, transfers) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(numAccounts, transfers):\n    adj = [[] for _ in range(numAccounts)]\n    for u, v in transfers:\n        adj[u].append(v)\n    state = [0] * numAccounts\n    def has_cycle(u):\n        state[u] = 1\n        for v in adj[u]:\n            if state[v] == 1: return True\n            if state[v] == 0 and has_cycle(v): return True\n        state[u] = 2\n        return False\n    for i in range(numAccounts):\n        if state[i] == 0 and has_cycle(i): return True\n    return False",
            "javascript": "function solve(numAccounts, transfers) {\n    const adj = Array.from({ length: numAccounts }, () => []);\n    for (const [u, v] of transfers) adj[u].push(v);\n    const state = new Array(numAccounts).fill(0);\n    const hasCycle = (u) => {\n        state[u] = 1;\n        for (const v of adj[u]) {\n            if (state[v] === 1) return true;\n            if (state[v] === 0 && hasCycle(v)) return true;\n        }\n        state[u] = 2;\n        return false;\n    };\n    for (let i = 0; i < numAccounts; i++) {\n        if (state[i] === 0 && hasCycle(i)) return true;\n    }\n    return false;\n}"
        },
        "testCases": [
            {
                "args": [
                    4,
                    [
                        [
                            0,
                            1
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            2,
                            3
                        ],
                        [
                            3,
                            0
                        ]
                    ]
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    3,
                    [
                        [
                            0,
                            1
                        ],
                        [
                            1,
                            2
                        ]
                    ]
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-9",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 9,
        "title": "Foreign Exchange Bid-Ask Spread PnL",
        "difficulty": "Easy",
        "topic": "Financial Math",
        "frequency": "89% in JPMorgan FX Markets",
        "context": "Market maker bid-ask spread revenue",
        "fnName": "solve",
        "params": [
            {
                "name": "trades",
                "type": "float[][]"
            }
        ],
        "returnType": "float",
        "description": "Each trade is `[units, buyPrice, sellPrice]`. Profit on each trade is `units * (sellPrice - buyPrice)`. Return total gross profit rounded to 2 decimal places.",
        "constraints": [
            "1 <= trades.length <= 10^4"
        ],
        "hint": "Sum units * (sell - buy) across trades.",
        "starter": {
            "python": "def solve(trades):\n    # Write your logic here\n    return 0.0",
            "javascript": "function solve(trades) {\n    // Write your logic here\n    return 0.0;\n}"
        },
        "solution": {
            "python": "def solve(trades):\n    return round(sum(units * (sell - buy) for units, buy, sell in trades), 2)",
            "javascript": "function solve(trades) {\n    const total = trades.reduce((acc, [u, b, s]) => acc + u * (s - b), 0);\n    return Math.round(total * 100) / 100;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1000,
                            82.5,
                            82.55
                        ],
                        [
                            2000,
                            82.4,
                            82.48
                        ]
                    ]
                ],
                "expected": 210,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-10",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 10,
        "title": "Cheque Clearing House Float Latency",
        "difficulty": "Medium",
        "topic": "Simulation & Sorting",
        "frequency": "90% in JPMorgan Operations",
        "context": "Optimizing batch cheque clearance cycles",
        "fnName": "solve",
        "params": [
            {
                "name": "chequeArrivalHours",
                "type": "int[]"
            },
            {
                "name": "cutoffHour",
                "type": "int"
            },
            {
                "name": "processingDaysNormal",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given arrival hours of cheques in a day. If `chequeArrivalHours[i] <= cutoffHour`, clearing takes `processingDaysNormal` days. If after cutoff, it takes `processingDaysNormal + 1` days. Return days required for each cheque.",
        "constraints": [
            "1 <= chequeArrivalHours.length <= 1000"
        ],
        "hint": "Simple ternary check per cheque.",
        "starter": {
            "python": "def solve(chequeArrivalHours, cutoffHour, processingDaysNormal):\n    # Write your logic here\n    return []",
            "javascript": "function solve(chequeArrivalHours, cutoffHour, processingDaysNormal) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(chequeArrivalHours, cutoffHour, processingDaysNormal):\n    return [processingDaysNormal if h <= cutoffHour else processingDaysNormal + 1 for h in chequeArrivalHours]",
            "javascript": "function solve(chequeArrivalHours, cutoffHour, processingDaysNormal) {\n    return chequeArrivalHours.map(h => h <= cutoffHour ? processingDaysNormal : processingDaysNormal + 1);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        14,
                        16,
                        18
                    ],
                    15,
                    2
                ],
                "expected": [
                    2,
                    2,
                    3,
                    3
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-11",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 11,
        "title": "Checking Account Overdraft Fee Penalty Calculation",
        "difficulty": "Easy",
        "topic": "State Simulation",
        "frequency": "91% in JPMorgan Consumer Banking",
        "context": "Overdraft threshold protection",
        "fnName": "solve",
        "params": [
            {
                "name": "startingBalance",
                "type": "int"
            },
            {
                "name": "transactions",
                "type": "int[]"
            },
            {
                "name": "overdraftFee",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Process sequential `transactions` (positive credit, negative debit). If a transaction causes balance to drop strictly below 0, an `overdraftFee` is immediately deducted. Return final balance.",
        "constraints": [
            "startingBalance >= 0",
            "1 <= transactions.length <= 1000"
        ],
        "hint": "Track running balance. If balance + tx < 0, subtract overdraftFee too.",
        "starter": {
            "python": "def solve(startingBalance, transactions, overdraftFee):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(startingBalance, transactions, overdraftFee) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(startingBalance, transactions, overdraftFee):\n    bal = startingBalance\n    for tx in transactions:\n        bal += tx\n        if bal < 0:\n            bal -= overdraftFee\n    return bal",
            "javascript": "function solve(startingBalance, transactions, overdraftFee) {\n    let bal = startingBalance;\n    for (const tx of transactions) {\n        bal += tx;\n        if (bal < 0) bal -= overdraftFee;\n    }\n    return bal;\n}"
        },
        "testCases": [
            {
                "args": [
                    100,
                    [
                        -150,
                        200,
                        -30
                    ],
                    35
                ],
                "expected": 85,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-12",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 12,
        "title": "Bond Coupon Macaulay Duration",
        "difficulty": "Medium",
        "topic": "Quantitative Finance Math",
        "frequency": "94% in JPMorgan Fixed Income",
        "context": "Interest rate sensitivity of government bond portfolios",
        "fnName": "solve",
        "params": [
            {
                "name": "coupons",
                "type": "float[]"
            },
            {
                "name": "yieldRatePct",
                "type": "float"
            },
            {
                "name": "faceValue",
                "type": "float"
            }
        ],
        "returnType": "float",
        "description": "Given annual cash flows in `coupons` (years 1 to N, last year includes `faceValue` repayment) and discount `yieldRatePct` (e.g. 5.0 for 5%). Macaulay duration is `sum(t * PV_t) / sum(PV_t)` where `PV_t = CF_t / (1 + y)^t`. Return duration rounded to 2 decimal places.",
        "constraints": [
            "coupons.length >= 1",
            "yieldRatePct > 0"
        ],
        "hint": "Discount each year cashflow, weight by year t, divide weighted sum by total PV.",
        "starter": {
            "python": "def solve(coupons, yieldRatePct, faceValue):\n    # Write your logic here\n    return 0.0",
            "javascript": "function solve(coupons, yieldRatePct, faceValue) {\n    // Write your logic here\n    return 0.0;\n}"
        },
        "solution": {
            "python": "def solve(coupons, yieldRatePct, faceValue):\n    y = yieldRatePct / 100.0\n    total_pv = 0.0\n    weighted_pv = 0.0\n    n = len(coupons)\n    for t in range(1, n + 1):\n        cf = coupons[t - 1] + (faceValue if t == n else 0.0)\n        pv = cf / ((1.0 + y) ** t)\n        total_pv += pv\n        weighted_pv += t * pv\n    return round(float(weighted_pv / total_pv), 2)",
            "javascript": "function solve(coupons, yieldRatePct, faceValue) {\n    const y = yieldRatePct / 100;\n    let totalPv = 0, weightedPv = 0;\n    const n = coupons.length;\n    for (let t = 1; t <= n; t++) {\n        const cf = coupons[t - 1] + (t === n ? faceValue : 0);\n        const pv = cf / Math.pow(1 + y, t);\n        totalPv += pv;\n        weightedPv += t * pv;\n    }\n    return Math.round((weightedPv / totalPv) * 100) / 100;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        50,
                        50,
                        50
                    ],
                    5,
                    1000
                ],
                "expected": 2.86,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-13",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 13,
        "title": "KYC Document Expiry Date Validator",
        "difficulty": "Easy",
        "topic": "Date Parsing & Comparison",
        "frequency": "90% in JPMorgan Client Onboarding",
        "context": "Checking if passport / national ID is currently valid",
        "fnName": "solve",
        "params": [
            {
                "name": "expiryDate",
                "type": "string"
            },
            {
                "name": "currentDate",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Dates are formatted as `YYYY-MM-DD`. Return `true` if `expiryDate >= currentDate` (document is still valid), else `false`.",
        "constraints": [
            "Valid ISO 8601 YYYY-MM-DD strings"
        ],
        "hint": "Lexicographical string comparison directly works for YYYY-MM-DD.",
        "starter": {
            "python": "def solve(expiryDate, currentDate):\n    # Write your logic here\n    return False",
            "javascript": "function solve(expiryDate, currentDate) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(expiryDate, currentDate):\n    return expiryDate >= currentDate",
            "javascript": "function solve(expiryDate, currentDate) {\n    return expiryDate >= currentDate;\n}"
        },
        "testCases": [
            {
                "args": [
                    "2028-12-31",
                    "2026-11-17"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "2025-05-01",
                    "2026-11-17"
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-14",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 14,
        "title": "SWIFT BIC Code International Routing Format",
        "difficulty": "Easy",
        "topic": "Regex",
        "frequency": "95% in JPMorgan Global Payments",
        "context": "Validating cross-border wire instruction routing codes",
        "fnName": "solve",
        "params": [
            {
                "name": "swiftBic",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "A valid SWIFT/BIC code has either 8 or 11 characters: 4 letters (Bank code) + 2 letters (Country code) + 2 alphanumeric (Location code) + optional 3 alphanumeric (Branch code). Return `true` if valid.",
        "constraints": [
            "Non-empty string"
        ],
        "hint": "Regex: ^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$.",
        "starter": {
            "python": "def solve(swiftBic):\n    # Write your logic here\n    return False",
            "javascript": "function solve(swiftBic) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(swiftBic):\n    import re\n    return bool(re.match(r'^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$', swiftBic))",
            "javascript": "function solve(swiftBic) {\n    return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftBic);\n}"
        },
        "testCases": [
            {
                "args": [
                    "CHASUS33XXX"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "CHASUS3"
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-15",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 15,
        "title": "Loan Default Risk Logistic Probability Threshold",
        "difficulty": "Easy",
        "topic": "Math & Sigmoid",
        "frequency": "91% in JPMorgan Risk Analytics",
        "context": "Logistic regression credit risk scoring",
        "fnName": "solve",
        "params": [
            {
                "name": "weights",
                "type": "float[]"
            },
            {
                "name": "features",
                "type": "float[]"
            },
            {
                "name": "bias",
                "type": "float"
            }
        ],
        "returnType": "float",
        "description": "Calculate logistic regression probability `P = 1 / (1 + exp(-(sum(w * x) + bias)))`. Return probability rounded to 4 decimal places.",
        "constraints": [
            "weights.length == features.length"
        ],
        "hint": "Compute dot product + bias, then sigmoid.",
        "starter": {
            "python": "def solve(weights, features, bias):\n    # Write your logic here\n    return 0.0",
            "javascript": "function solve(weights, features, bias) {\n    // Write your logic here\n    return 0.0;\n}"
        },
        "solution": {
            "python": "def solve(weights, features, bias):\n    import math\n    z = sum(w * x for w, x in zip(weights, features)) + bias\n    p = 1.0 / (1.0 + math.exp(-z))\n    return round(float(p), 4)",
            "javascript": "function solve(weights, features, bias) {\n    const z = weights.reduce((acc, w, i) => acc + w * features[i], 0) + bias;\n    const p = 1 / (1 + Math.exp(-z));\n    return Math.round(p * 10000) / 10000;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        0.5,
                        -0.2
                    ],
                    [
                        2,
                        1
                    ],
                    0.1
                ],
                "expected": 0.7109,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-16",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 16,
        "title": "Corporate Treasury Cash Ladder Forecasting",
        "difficulty": "Medium",
        "topic": "Prefix Sum & Minimum Balance",
        "frequency": "93% in JPMorgan Treasury",
        "context": "Predicting minimum overnight liquidity requirement",
        "fnName": "solve",
        "params": [
            {
                "name": "initialLiquidity",
                "type": "int"
            },
            {
                "name": "dailyCashFlows",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given `initialLiquidity` and projected `dailyCashFlows`. Find the lowest liquidity balance encountered at any point across the period.",
        "constraints": [
            "1 <= dailyCashFlows.length <= 10^5"
        ],
        "hint": "Track running balance and find minimum.",
        "starter": {
            "python": "def solve(initialLiquidity, dailyCashFlows):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(initialLiquidity, dailyCashFlows) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(initialLiquidity, dailyCashFlows):\n    curr = initialLiquidity\n    lowest = initialLiquidity\n    for cf in dailyCashFlows:\n        curr += cf\n        lowest = min(lowest, curr)\n    return lowest",
            "javascript": "function solve(initialLiquidity, dailyCashFlows) {\n    let curr = initialLiquidity;\n    let lowest = initialLiquidity;\n    for (const cf of dailyCashFlows) {\n        curr += cf;\n        lowest = Math.min(lowest, curr);\n    }\n    return lowest;\n}"
        },
        "testCases": [
            {
                "args": [
                    5000,
                    [
                        -2000,
                        -4000,
                        3000,
                        -1000
                    ]
                ],
                "expected": -1000,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-17",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 17,
        "title": "Inter-Bank Wire Transfer Batch Packing",
        "difficulty": "Medium",
        "topic": "Greedy Bin Packing",
        "frequency": "90% in JPMorgan Wholesale Payments",
        "context": "Grouping settlement messages into maximum batch byte limit",
        "fnName": "solve",
        "params": [
            {
                "name": "messageSizes",
                "type": "int[]"
            },
            {
                "name": "batchLimit",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given message sizes, find minimum number of batches required to transmit all messages if each batch can hold at most `batchLimit` bytes (assuming items are packed in given order).",
        "constraints": [
            "1 <= messageSizes.length <= 10^5",
            "messageSizes[i] <= batchLimit"
        ],
        "hint": "Greedy linear traversal accumulating current batch until limit exceeded.",
        "starter": {
            "python": "def solve(messageSizes, batchLimit):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(messageSizes, batchLimit) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(messageSizes, batchLimit):\n    batches = 1\n    curr = 0\n    for sz in messageSizes:\n        if curr + sz > batchLimit:\n            batches += 1\n            curr = sz\n        else:\n            curr += sz\n    return batches",
            "javascript": "function solve(messageSizes, batchLimit) {\n    let batches = 1, curr = 0;\n    for (const sz of messageSizes) {\n        if (curr + sz > batchLimit) {\n            batches++;\n            curr = sz;\n        } else {\n            curr += sz;\n        }\n    }\n    return batches;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        100,
                        200,
                        300,
                        150,
                        250
                    ],
                    450
                ],
                "expected": 3,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-18",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 18,
        "title": "Option Payoff Straddle Strategy Simulation",
        "difficulty": "Easy",
        "topic": "Derivatives Math",
        "frequency": "92% in JPMorgan Derivatives Trading",
        "context": "Computing option payoff at expiration",
        "fnName": "solve",
        "params": [
            {
                "name": "strikePrice",
                "type": "float"
            },
            {
                "name": "totalPremium",
                "type": "float"
            },
            {
                "name": "spotPrices",
                "type": "float[]"
            }
        ],
        "returnType": "float[]",
        "description": "A long straddle consists of 1 call and 1 put at `strikePrice`. Net payoff at expiration for spot price `S` is `max(S - strike, 0) + max(strike - S, 0) - totalPremium = |S - strike| - totalPremium`. Return payoffs rounded to 2 decimal places.",
        "constraints": [
            "spotPrices.length >= 1"
        ],
        "hint": "Formula: abs(spot - strike) - totalPremium.",
        "starter": {
            "python": "def solve(strikePrice, totalPremium, spotPrices):\n    # Write your logic here\n    return []",
            "javascript": "function solve(strikePrice, totalPremium, spotPrices) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(strikePrice, totalPremium, spotPrices):\n    return [round(abs(s - strikePrice) - totalPremium, 2) for s in spotPrices]",
            "javascript": "function solve(strikePrice, totalPremium, spotPrices) {\n    return spotPrices.map(s => Math.round((Math.abs(s - strikePrice) - totalPremium) * 100) / 100);\n}"
        },
        "testCases": [
            {
                "args": [
                    100,
                    15,
                    [
                        80,
                        100,
                        125
                    ]
                ],
                "expected": [
                    5,
                    -15,
                    10
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-19",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 19,
        "title": "Safe Deposit Locker Range Allocator",
        "difficulty": "Medium",
        "topic": "Interval Tracking",
        "frequency": "89% in JPMorgan Branch Systems",
        "context": "Allocating contiguous safe deposit lockers to corporate clients",
        "fnName": "solve",
        "params": [
            {
                "name": "totalLockers",
                "type": "int"
            },
            {
                "name": "occupied",
                "type": "int[]"
            },
            {
                "name": "requiredContiguous",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Lockers are numbered `1` to `totalLockers`. Given list of `occupied` locker numbers. Find smallest starting locker number `k` such that lockers `[k, k + requiredContiguous - 1]` are all available. Return `-1` if no contiguous block exists.",
        "constraints": [
            "1 <= totalLockers <= 10^5",
            "requiredContiguous >= 1"
        ],
        "hint": "Track consecutive free lockers.",
        "starter": {
            "python": "def solve(totalLockers, occupied, requiredContiguous):\n    # Write your logic here\n    return -1",
            "javascript": "function solve(totalLockers, occupied, requiredContiguous) {\n    // Write your logic here\n    return -1;\n}"
        },
        "solution": {
            "python": "def solve(totalLockers, occupied, requiredContiguous):\n    occ_set = set(occupied)\n    consec = 0\n    start = 1\n    for i in range(1, totalLockers + 1):\n        if i in occ_set:\n            consec = 0\n            start = i + 1\n        else:\n            consec += 1\n            if consec == requiredContiguous:\n                return start\n    return -1",
            "javascript": "function solve(totalLockers, occupied, requiredContiguous) {\n    const occSet = new Set(occupied);\n    let consec = 0, start = 1;\n    for (let i = 1; i <= totalLockers; i++) {\n        if (occSet.has(i)) {\n            consec = 0;\n            start = i + 1;\n        } else {\n            consec++;\n            if (consec === requiredContiguous) return start;\n        }\n    }\n    return -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    10,
                    [
                        2,
                        5,
                        6
                    ],
                    3
                ],
                "expected": 7,
                "isHidden": false
            },
            {
                "args": [
                    10,
                    [
                        2,
                        4,
                        6,
                        8
                    ],
                    3
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "jpm-20",
        "company": "jpmorgan",
        "category": "fintech",
        "number": 20,
        "title": "Card Authorization Velocity Window Alert",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "frequency": "95% in JPMorgan Fraud Prevention",
        "context": "Card fraud real-time auth spikes",
        "fnName": "solve",
        "params": [
            {
                "name": "authTimes",
                "type": "int[]"
            },
            {
                "name": "windowMinutes",
                "type": "int"
            },
            {
                "name": "thresholdCount",
                "type": "int"
            }
        ],
        "returnType": "bool",
        "description": "Given sorted authorization request minutes `authTimes`. Return `true` if there exists any time window of length `windowMinutes` (i.e. `authTimes[j] - authTimes[i] <= windowMinutes`) containing at least `thresholdCount` requests.",
        "constraints": [
            "1 <= authTimes.length <= 10^5"
        ],
        "hint": "Two pointer sliding window: right - left + 1 >= thresholdCount.",
        "starter": {
            "python": "def solve(authTimes, windowMinutes, thresholdCount):\n    # Write your logic here\n    return False",
            "javascript": "function solve(authTimes, windowMinutes, thresholdCount) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(authTimes, windowMinutes, thresholdCount):\n    l = 0\n    for r in range(len(authTimes)):\n        while authTimes[r] - authTimes[l] > windowMinutes:\n            l += 1\n        if r - l + 1 >= thresholdCount:\n            return True\n    return False",
            "javascript": "function solve(authTimes, windowMinutes, thresholdCount) {\n    let l = 0;\n    for (let r = 0; r < authTimes.length; r++) {\n        while (authTimes[r] - authTimes[l] > windowMinutes) l++;\n        if (r - l + 1 >= thresholdCount) return true;\n    }\n    return false;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        5,
                        12,
                        14,
                        18,
                        45
                    ],
                    10,
                    3
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    [
                        10,
                        30,
                        50
                    ],
                    10,
                    2
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    }
];
