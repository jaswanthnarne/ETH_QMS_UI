export const ZOMATO_QUESTIONS = [
    {
        "id": "zom-1",
        "company": "zomato",
        "category": "startup",
        "number": 1,
        "title": "Zomato Gold Table Reservation Allocator",
        "difficulty": "Medium",
        "topic": "Greedy & Binary Search",
        "frequency": "95% in Zomato Dining",
        "context": "Peak Friday night dining table booking",
        "fnName": "solve",
        "params": [
            {
                "name": "tableSizes",
                "type": "int[]"
            },
            {
                "name": "partySize",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "A restaurant has tables with seating capacities given in `tableSizes`. When a party of size `partySize` arrives, assign the smallest available table that can accommodate them (`tableSize >= partySize`). Return the capacity of that table, or `-1` if no table fits.",
        "constraints": [
            "1 <= tableSizes.length <= 10^5",
            "1 <= partySize <= 100"
        ],
        "hint": "Filter tables >= partySize and find minimum, or sort and binary search with lower_bound.",
        "starter": {
            "python": "def solve(tableSizes, partySize):\n    # Write your logic here\n    return -1",
            "javascript": "function solve(tableSizes, partySize) {\n    // Write your logic here\n    return -1;\n}"
        },
        "solution": {
            "python": "def solve(tableSizes, partySize):\n    valid = [t for t in tableSizes if t >= partySize]\n    return min(valid) if valid else -1",
            "javascript": "function solve(tableSizes, partySize) {\n    const valid = tableSizes.filter(t => t >= partySize);\n    return valid.length > 0 ? Math.min(...valid) : -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        4,
                        4,
                        6,
                        8
                    ],
                    5
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    [
                        2,
                        4,
                        4
                    ],
                    6
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-2",
        "company": "zomato",
        "category": "startup",
        "number": 2,
        "title": "Blinkit 10-Minute Dark Store Route Latency",
        "difficulty": "Medium",
        "topic": "Shortest Path (Dijkstra)",
        "frequency": "94% in Blinkit Core",
        "context": "Guaranteed 10-minute dispatch routing",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            },
            {
                "name": "roads",
                "type": "int[][]"
            },
            {
                "name": "start",
                "type": "int"
            },
            {
                "name": "dest",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given `n` intersections (`0` to `n-1`) and bidirectional roads `[u, v, minutes]`. Find the fastest route latency from `start` to `dest`. If unreachable, return `-1`.",
        "constraints": [
            "1 <= n <= 1000",
            "0 <= roads.length <= 10^4"
        ],
        "hint": "Dijkstra algorithm using priority queue.",
        "starter": {
            "python": "def solve(n, roads, start, dest):\n    # Write your logic here\n    return -1",
            "javascript": "function solve(n, roads, start, dest) {\n    // Write your logic here\n    return -1;\n}"
        },
        "solution": {
            "python": "def solve(n, roads, start, dest):\n    import heapq\n    from collections import defaultdict\n    adj = defaultdict(list)\n    for u, v, w in roads:\n        adj[u].append((v, w))\n        adj[v].append((u, w))\n    pq = [(0, start)]\n    dist = {start: 0}\n    while pq:\n        d, u = heapq.heappop(pq)\n        if u == dest: return d\n        if d > dist.get(u, float('inf')): continue\n        for v, w in adj[u]:\n            if d + w < dist.get(v, float('inf')):\n                dist[v] = d + w\n                heapq.heappush(pq, (d + w, v))\n    return -1",
            "javascript": "function solve(n, roads, start, dest) {\n    const adj = Array.from({ length: n }, () => []);\n    for (const [u, v, w] of roads) {\n        adj[u].push([v, w]);\n        adj[v].push([u, w]);\n    }\n    const dist = new Array(n).fill(Infinity);\n    dist[start] = 0;\n    const q = [[0, start]];\n    while (q.length > 0) {\n        q.sort((a, b) => a[0] - b[0]);\n        const [d, u] = q.shift();\n        if (u === dest) return d;\n        if (d > dist[u]) continue;\n        for (const [v, w] of adj[u]) {\n            if (d + w < dist[v]) {\n                dist[v] = d + w;\n                q.push([d + w, v]);\n            }\n        }\n    }\n    return -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    4,
                    [
                        [
                            0,
                            1,
                            3
                        ],
                        [
                            1,
                            2,
                            2
                        ],
                        [
                            0,
                            2,
                            8
                        ],
                        [
                            2,
                            3,
                            4
                        ]
                    ],
                    0,
                    3
                ],
                "expected": 9,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-3",
        "company": "zomato",
        "category": "startup",
        "number": 3,
        "title": "Review Sentiment Polarity Score",
        "difficulty": "Easy",
        "topic": "String Parsing & Hash Set",
        "frequency": "90% in Zomato Reviews",
        "context": "Automated user feedback tagging",
        "fnName": "solve",
        "params": [
            {
                "name": "review",
                "type": "string"
            },
            {
                "name": "positiveWords",
                "type": "string[]"
            },
            {
                "name": "negativeWords",
                "type": "string[]"
            }
        ],
        "returnType": "int",
        "description": "Given a text review and lists of positive and negative keywords. Sentiment score is `(count of positive words) - (count of negative words)`. Words are compared case-insensitively.",
        "constraints": [
            "1 <= review.length <= 1000"
        ],
        "hint": "Tokenize by words, check lowercase matches against positive and negative sets.",
        "starter": {
            "python": "def solve(review, positiveWords, negativeWords):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(review, positiveWords, negativeWords) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(review, positiveWords, negativeWords):\n    import re\n    words = re.findall(r'\\b[a-z]+\\b', review.lower())\n    pos = set(w.lower() for w in positiveWords)\n    neg = set(w.lower() for w in negativeWords)\n    return sum(1 for w in words if w in pos) - sum(1 for w in words if w in neg)",
            "javascript": "function solve(review, positiveWords, negativeWords) {\n    const words = review.toLowerCase().match(/[a-z]+/g) || [];\n    const pos = new Set(positiveWords.map(w => w.toLowerCase()));\n    const neg = new Set(negativeWords.map(w => w.toLowerCase()));\n    let score = 0;\n    for (const w of words) {\n        if (pos.has(w)) score++;\n        if (neg.has(w)) score--;\n    }\n    return score;\n}"
        },
        "testCases": [
            {
                "args": [
                    "The food was delicious and fresh but the service was slow",
                    [
                        "delicious",
                        "fresh",
                        "great"
                    ],
                    [
                        "slow",
                        "bad",
                        "cold"
                    ]
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-4",
        "company": "zomato",
        "category": "startup",
        "number": 4,
        "title": "Restaurant Menu Fuzzy Search (Edit Distance)",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "93% in Zomato Search",
        "context": "Typo-tolerant food item search",
        "fnName": "solve",
        "params": [
            {
                "name": "query",
                "type": "string"
            },
            {
                "name": "menuItem",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Calculate the minimum Levenshtein edit distance (insertions, deletions, substitutions) between user search `query` and catalog `menuItem`.",
        "constraints": [
            "1 <= query.length, menuItem.length <= 100"
        ],
        "hint": "Classic 2D DP for minimum edit distance.",
        "starter": {
            "python": "def solve(query, menuItem):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(query, menuItem) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(query, menuItem):\n    m, n = len(query), len(menuItem)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1): dp[i][0] = i\n    for j in range(n + 1): dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if query[i - 1] == menuItem[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]",
            "javascript": "function solve(query, menuItem) {\n    const m = query.length, n = menuItem.length;\n    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n    for (let i = 0; i <= m; i++) dp[i][0] = i;\n    for (let j = 0; j <= n; j++) dp[0][j] = j;\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (query[i - 1] === menuItem[j - 1]) {\n                dp[i][j] = dp[i - 1][j - 1];\n            } else {\n                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n            }\n        }\n    }\n    return dp[m][n];\n}"
        },
        "testCases": [
            {
                "args": [
                    "biryani",
                    "briyani"
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    "paneer",
                    "paner"
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-5",
        "company": "zomato",
        "category": "startup",
        "number": 5,
        "title": "Bill Splitting with Split GST & Service Charge",
        "difficulty": "Easy",
        "topic": "Financial Math",
        "frequency": "91% in Zomato Pay",
        "context": "Accurate point-of-sale invoice computation",
        "fnName": "solve",
        "params": [
            {
                "name": "itemPrices",
                "type": "float[]"
            },
            {
                "name": "gstPercent",
                "type": "float"
            },
            {
                "name": "serviceChargePercent",
                "type": "float"
            },
            {
                "name": "numPeople",
                "type": "int"
            }
        ],
        "returnType": "float",
        "description": "Given item prices, calculate final bill by adding service charge first, then applying GST on the total (subtotal + service charge). Split equally among `numPeople` rounded to 2 decimal places.",
        "constraints": [
            "itemPrices.length >= 1",
            "numPeople >= 1"
        ],
        "hint": "Subtotal = sum(prices). Service = Subtotal * (sc/100). Tax = (Subtotal + Service) * (gst/100). Total = Subtotal + Service + Tax.",
        "starter": {
            "python": "def solve(itemPrices, gstPercent, serviceChargePercent, numPeople):\n    # Write your logic here\n    return 0.0",
            "javascript": "function solve(itemPrices, gstPercent, serviceChargePercent, numPeople) {\n    // Write your logic here\n    return 0.0;\n}"
        },
        "solution": {
            "python": "def solve(itemPrices, gstPercent, serviceChargePercent, numPeople):\n    subtotal = sum(itemPrices)\n    sc = subtotal * (serviceChargePercent / 100.0)\n    tax = (subtotal + sc) * (gstPercent / 100.0)\n    total = subtotal + sc + tax\n    return round(float(total / numPeople), 2)",
            "javascript": "function solve(itemPrices, gstPercent, serviceChargePercent, numPeople) {\n    const subtotal = itemPrices.reduce((a, b) => a + b, 0);\n    const sc = subtotal * (serviceChargePercent / 100);\n    const tax = (subtotal + sc) * (gstPercent / 100);\n    const total = subtotal + sc + tax;\n    return Math.round((total / numPeople) * 100) / 100;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1000,
                        500
                    ],
                    5,
                    10,
                    3
                ],
                "expected": 577.5,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-6",
        "company": "zomato",
        "category": "startup",
        "number": 6,
        "title": "Zomato Gold Coin Cashback Redemption",
        "difficulty": "Medium",
        "topic": "Greedy Strategy",
        "frequency": "89% in Zomato Loyalty",
        "context": "Optimum loyalty points redemption",
        "fnName": "solve",
        "params": [
            {
                "name": "coins",
                "type": "int"
            },
            {
                "name": "couponValues",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "A customer has `coins` gold coins. Vouchers of values `couponValues` can each be redeemed once for 100 coins per coupon. Return maximum total voucher value the user can unlock.",
        "constraints": [
            "coins >= 0",
            "1 <= couponValues.length <= 10^4"
        ],
        "hint": "Allowed redemptions k = coins // 100. Pick top-k largest vouchers.",
        "starter": {
            "python": "def solve(coins, couponValues):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(coins, couponValues) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(coins, couponValues):\n    k = coins // 100\n    couponValues.sort(reverse=True)\n    return sum(couponValues[:k])",
            "javascript": "function solve(coins, couponValues) {\n    const k = Math.floor(coins / 100);\n    const sorted = [...couponValues].sort((a, b) => b - a);\n    return sorted.slice(0, k).reduce((a, b) => a + b, 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    250,
                    [
                        50,
                        100,
                        200,
                        150
                    ]
                ],
                "expected": 350,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-7",
        "company": "zomato",
        "category": "startup",
        "number": 7,
        "title": "Dining Out Table Turnaround Optimization (Meeting Rooms II)",
        "difficulty": "Medium",
        "topic": "Min-Heap",
        "frequency": "95% in Zomato Dining",
        "context": "Peak restaurant table occupancy tracking",
        "fnName": "solve",
        "params": [
            {
                "name": "bookings",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given reservation time ranges `bookings[i] = [start, end]`. Find the minimum number of physical tables required to serve all parties without wait times.",
        "constraints": [
            "1 <= bookings.length <= 10^5"
        ],
        "hint": "Sort starts and ends separately, or use a min-heap of active end times.",
        "starter": {
            "python": "def solve(bookings):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(bookings) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(bookings):\n    import heapq\n    if not bookings: return 0\n    bookings.sort(key=lambda x: x[0])\n    pq = []\n    for s, e in bookings:\n        if pq and pq[0] <= s:\n            heapq.heappop(pq)\n        heapq.heappush(pq, e)\n    return len(pq)",
            "javascript": "function solve(bookings) {\n    if (bookings.length === 0) return 0;\n    const starts = bookings.map(b => b[0]).sort((a, b) => a - b);\n    const ends = bookings.map(b => b[1]).sort((a, b) => a - b);\n    let tables = 0, endIdx = 0;\n    for (let i = 0; i < starts.length; i++) {\n        if (starts[i] < ends[endIdx]) {\n            tables++;\n        } else {\n            endIdx++;\n        }\n    }\n    return tables;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            0,
                            30
                        ],
                        [
                            5,
                            10
                        ],
                        [
                            15,
                            20
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
                            7,
                            10
                        ],
                        [
                            2,
                            4
                        ]
                    ]
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-8",
        "company": "zomato",
        "category": "startup",
        "number": 8,
        "title": "Delivery Rider Geofence Radius Verification",
        "difficulty": "Easy",
        "topic": "Geometry & Math",
        "frequency": "92% in Zomato Fleet",
        "context": "Checking if rider is inside the restaurant geofence circle",
        "fnName": "solve",
        "params": [
            {
                "name": "riderCoords",
                "type": "int[][]"
            },
            {
                "name": "restaurantCoord",
                "type": "int[]"
            },
            {
                "name": "radius",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given 2D coordinates `riderCoords[i] = [x, y]` of riders, restaurant at `[rx, ry]`, and geofence `radius`. Count how many riders are inside or on the geofence boundary: `(x - rx)^2 + (y - ry)^2 <= radius^2`.",
        "constraints": [
            "1 <= riderCoords.length <= 10^4",
            "radius >= 0"
        ],
        "hint": "Euclidean distance squared check avoids precision loss.",
        "starter": {
            "python": "def solve(riderCoords, restaurantCoord, radius):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(riderCoords, restaurantCoord, radius) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(riderCoords, restaurantCoord, radius):\n    rx, ry = restaurantCoord\n    r_sq = radius * radius\n    return sum(1 for x, y in riderCoords if (x - rx)**2 + (y - ry)**2 <= r_sq)",
            "javascript": "function solve(riderCoords, restaurantCoord, radius) {\n    const [rx, ry] = restaurantCoord;\n    const rSq = radius * radius;\n    return riderCoords.filter(([x, y]) => (x - rx) ** 2 + (y - ry) ** 2 <= rSq).length;\n}"
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
                        ],
                        [
                            0,
                            0
                        ],
                        [
                            5,
                            5
                        ]
                    ],
                    [
                        0,
                        0
                    ],
                    3
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-9",
        "company": "zomato",
        "category": "startup",
        "number": 9,
        "title": "Restaurant Multi-Factor Hygiene & Rating Sorter",
        "difficulty": "Medium",
        "topic": "Custom Sorting",
        "frequency": "89% in Zomato Quality",
        "context": "Ranked restaurant listing",
        "fnName": "solve",
        "params": [
            {
                "name": "restaurants",
                "type": "int[][]"
            }
        ],
        "returnType": "int[][]",
        "description": "Each restaurant has `[id, rating, hygieneScore, deliveryTime]`. Sort restaurants by `rating` descending. On tie, sort by `hygieneScore` descending. On tie, sort by `deliveryTime` ascending. On tie, sort by `id` ascending.",
        "constraints": [
            "1 <= restaurants.length <= 10^4"
        ],
        "hint": "Multi-key sort lambda (-rating, -hygiene, deliveryTime, id).",
        "starter": {
            "python": "def solve(restaurants):\n    # Write your logic here\n    return []",
            "javascript": "function solve(restaurants) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(restaurants):\n    return sorted(restaurants, key=lambda x: (-x[1], -x[2], x[3], x[0]))",
            "javascript": "function solve(restaurants) {\n    return [...restaurants].sort((a, b) => {\n        if (a[1] !== b[1]) return b[1] - a[1];\n        if (a[2] !== b[2]) return b[2] - a[2];\n        if (a[3] !== b[3]) return a[3] - b[3];\n        return a[0] - b[0];\n    });\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            4,
                            90,
                            30
                        ],
                        [
                            2,
                            5,
                            80,
                            45
                        ],
                        [
                            3,
                            4,
                            95,
                            25
                        ]
                    ]
                ],
                "expected": [
                    [
                        2,
                        5,
                        80,
                        45
                    ],
                    [
                        3,
                        4,
                        95,
                        25
                    ],
                    [
                        1,
                        4,
                        90,
                        30
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-10",
        "company": "zomato",
        "category": "startup",
        "number": 10,
        "title": "Night Owl Delivery Surcharge Calculation",
        "difficulty": "Easy",
        "topic": "Time Calculation",
        "frequency": "88% in Zomato Delivery",
        "context": "Late-night delivery fee adjustment",
        "fnName": "solve",
        "params": [
            {
                "name": "hour",
                "type": "int"
            },
            {
                "name": "basePrice",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given order placement `hour` (0 to 23). If hour is between 23 and 4 inclusive (i.e. 23, 0, 1, 2, 3, 4), apply night surcharge of 40%. Otherwise surcharge is 0%. Return total rounded down to integer.",
        "constraints": [
            "0 <= hour <= 23",
            "basePrice >= 0"
        ],
        "hint": "Condition: hour >= 23 or hour <= 4.",
        "starter": {
            "python": "def solve(hour, basePrice):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(hour, basePrice) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(hour, basePrice):\n    if hour >= 23 or hour <= 4:\n        return int(basePrice * 1.4)\n    return basePrice",
            "javascript": "function solve(hour, basePrice) {\n    if (hour >= 23 || hour <= 4) {\n        return Math.floor(basePrice * 1.4);\n    }\n    return basePrice;\n}"
        },
        "testCases": [
            {
                "args": [
                    23,
                    200
                ],
                "expected": 280,
                "isHidden": false
            },
            {
                "args": [
                    14,
                    200
                ],
                "expected": 200,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-11",
        "company": "zomato",
        "category": "startup",
        "number": 11,
        "title": "Blinkit Quick-Commerce Inventory Reorder Trigger",
        "difficulty": "Easy",
        "topic": "Simulation",
        "frequency": "91% in Blinkit Warehouse",
        "context": "Automated SKU restocking trigger",
        "fnName": "solve",
        "params": [
            {
                "name": "stock",
                "type": "int[]"
            },
            {
                "name": "dailyBurn",
                "type": "int[]"
            },
            {
                "name": "leadTimeDays",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given current `stock` and `dailyBurn` rate for SKUs. If `stock[i] <= dailyBurn[i] * leadTimeDays`, the SKU needs immediate reorder. Return indices of all SKUs that need reordering.",
        "constraints": [
            "1 <= stock.length <= 10^4",
            "dailyBurn.length == stock.length"
        ],
        "hint": "Filter indices where stock[i] <= dailyBurn[i] * leadTimeDays.",
        "starter": {
            "python": "def solve(stock, dailyBurn, leadTimeDays):\n    # Write your logic here\n    return []",
            "javascript": "function solve(stock, dailyBurn, leadTimeDays) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(stock, dailyBurn, leadTimeDays):\n    return [i for i in range(len(stock)) if stock[i] <= dailyBurn[i] * leadTimeDays]",
            "javascript": "function solve(stock, dailyBurn, leadTimeDays) {\n    const res = [];\n    for (let i = 0; i < stock.length; i++) {\n        if (stock[i] <= dailyBurn[i] * leadTimeDays) res.push(i);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        100,
                        30,
                        15
                    ],
                    [
                        20,
                        10,
                        5
                    ],
                    3
                ],
                "expected": [
                    1,
                    2
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-12",
        "company": "zomato",
        "category": "startup",
        "number": 12,
        "title": "Feeding India Food Donation Surplus Routing",
        "difficulty": "Medium",
        "topic": "Greedy Matching",
        "frequency": "89% in Feeding India",
        "context": "Connecting surplus event meals to shelters",
        "fnName": "solve",
        "params": [
            {
                "name": "surplusMeals",
                "type": "int[]"
            },
            {
                "name": "shelterDemands",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given `surplusMeals` from banquet donors and `shelterDemands`. A surplus batch can fulfill a shelter demand if `surplus >= demand`. Each surplus batch can only go to at most one shelter. Return maximum number of shelters satisfied.",
        "constraints": [
            "1 <= surplusMeals.length, shelterDemands.length <= 10^5"
        ],
        "hint": "Sort both arrays ascending. Use two pointers greedy matching.",
        "starter": {
            "python": "def solve(surplusMeals, shelterDemands):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(surplusMeals, shelterDemands) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(surplusMeals, shelterDemands):\n    surplusMeals.sort()\n    shelterDemands.sort()\n    i = j = 0\n    while i < len(surplusMeals) and j < len(shelterDemands):\n        if surplusMeals[i] >= shelterDemands[j]:\n            j += 1\n        i += 1\n    return j",
            "javascript": "function solve(surplusMeals, shelterDemands) {\n    const s = [...surplusMeals].sort((a, b) => a - b);\n    const d = [...shelterDemands].sort((a, b) => a - b);\n    let i = 0, j = 0;\n    while (i < s.length && j < d.length) {\n        if (s[i] >= d[j]) j++;\n        i++;\n    }\n    return j;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        50,
                        100,
                        150
                    ],
                    [
                        40,
                        90,
                        200
                    ]
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-13",
        "company": "zomato",
        "category": "startup",
        "number": 13,
        "title": "Repeated Review Phrase Spam Detection",
        "difficulty": "Medium",
        "topic": "Hash Set Rolling Hash",
        "frequency": "90% in Zomato Trust & Safety",
        "context": "Identifying bot generated restaurant reviews",
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
        "returnType": "string[]",
        "description": "Given review text `s`, return all repeated substrings of length `k` that occur more than once, sorted alphabetically.",
        "constraints": [
            "1 <= s.length <= 10^5",
            "1 <= k <= 10"
        ],
        "hint": "Slide window of length k. Keep seen set and duplicates set.",
        "starter": {
            "python": "def solve(s, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(s, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(s, k):\n    seen = set()\n    repeated = set()\n    for i in range(len(s) - k + 1):\n        sub = s[i : i + k]\n        if sub in seen:\n            repeated.add(sub)\n        seen.add(sub)\n    return sorted(list(repeated))",
            "javascript": "function solve(s, k) {\n    const seen = new Set();\n    const repeated = new Set();\n    for (let i = 0; i <= s.length - k; i++) {\n        const sub = s.slice(i, i + k);\n        if (seen.has(sub)) repeated.add(sub);\n        seen.add(sub);\n    }\n    return Array.from(repeated).sort();\n}"
        },
        "testCases": [
            {
                "args": [
                    "deliciousgooddeliciousbadgood",
                    4
                ],
                "expected": [
                    "deli",
                    "elici",
                    "good",
                    "icio",
                    "licio"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-14",
        "company": "zomato",
        "category": "startup",
        "number": 14,
        "title": "Kitchen Order Ticket (KOT) Sequence",
        "difficulty": "Medium",
        "topic": "Priority Queue",
        "frequency": "92% in Zomato POS",
        "context": "Restaurant chef display system dispatch queue",
        "fnName": "solve",
        "params": [
            {
                "name": "orders",
                "type": "int[][]"
            }
        ],
        "returnType": "int[]",
        "description": "Orders are given as `[orderId, prepTime, isVip]`. VIP orders (`isVip == 1`) always take precedence over normal orders (`0`). Within the same VIP tier, orders with smaller `prepTime` come first. If still tied, smaller `orderId` comes first. Return order of dispatched IDs.",
        "constraints": [
            "1 <= orders.length <= 10^5"
        ],
        "hint": "Sort with key (-isVip, prepTime, orderId).",
        "starter": {
            "python": "def solve(orders):\n    # Write your logic here\n    return []",
            "javascript": "function solve(orders) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(orders):\n    sorted_orders = sorted(orders, key=lambda x: (-x[2], x[1], x[0]))\n    return [x[0] for x in sorted_orders]",
            "javascript": "function solve(orders) {\n    const sorted = [...orders].sort((a, b) => {\n        if (a[2] !== b[2]) return b[2] - a[2];\n        if (a[1] !== b[1]) return a[1] - b[1];\n        return a[0] - b[0];\n    });\n    return sorted.map(x => x[0]);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            101,
                            20,
                            0
                        ],
                        [
                            102,
                            10,
                            1
                        ],
                        [
                            103,
                            15,
                            0
                        ],
                        [
                            104,
                            8,
                            1
                        ]
                    ]
                ],
                "expected": [
                    104,
                    102,
                    103,
                    101
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-15",
        "company": "zomato",
        "category": "startup",
        "number": 15,
        "title": "Lowest Common Cuisine Category Ancestor",
        "difficulty": "Medium",
        "topic": "Tree & LCA",
        "frequency": "91% in Zomato Taxonomy",
        "context": "Hierarchical cuisine tag ontology",
        "fnName": "solve",
        "params": [
            {
                "name": "parents",
                "type": "int[]"
            },
            {
                "name": "cat1",
                "type": "int"
            },
            {
                "name": "cat2",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given `parents` array representing a category tree where `parents[i]` is parent of category `i` (`parents[0] = -1` for root). Find lowest common category ancestor of `cat1` and `cat2`.",
        "constraints": [
            "1 <= parents.length <= 10^4",
            "0 <= cat1, cat2 < parents.length"
        ],
        "hint": "Trace ancestors of cat1 into a set, then climb up from cat2 until first match.",
        "starter": {
            "python": "def solve(parents, cat1, cat2):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(parents, cat1, cat2) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(parents, cat1, cat2):\n    anc = set()\n    curr = cat1\n    while curr != -1:\n        anc.add(curr)\n        curr = parents[curr]\n    curr = cat2\n    while curr != -1:\n        if curr in anc: return curr\n        curr = parents[curr]\n    return 0",
            "javascript": "function solve(parents, cat1, cat2) {\n    const anc = new Set();\n    let curr = cat1;\n    while (curr !== -1) {\n        anc.add(curr);\n        curr = parents[curr];\n    }\n    curr = cat2;\n    while (curr !== -1) {\n        if (anc.has(curr)) return curr;\n        curr = parents[curr];\n    }\n    return 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        -1,
                        0,
                        0,
                        1,
                        1,
                        2
                    ],
                    3,
                    4
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    [
                        -1,
                        0,
                        0,
                        1,
                        1,
                        2
                    ],
                    3,
                    5
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-16",
        "company": "zomato",
        "category": "startup",
        "number": 16,
        "title": "Discount Coupon Minimum Cart Value Threshold",
        "difficulty": "Easy",
        "topic": "Binary Search",
        "frequency": "88% in Zomato Checkout",
        "context": "Auto-suggesting the best eligible coupon",
        "fnName": "solve",
        "params": [
            {
                "name": "couponThresholds",
                "type": "int[]"
            },
            {
                "name": "cartValue",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given sorted `couponThresholds`. Return maximum threshold that is `<= cartValue`. If no coupon is eligible, return `-1`.",
        "constraints": [
            "1 <= couponThresholds.length <= 10^5"
        ],
        "hint": "Binary search upper_bound - 1.",
        "starter": {
            "python": "def solve(couponThresholds, cartValue):\n    # Write your logic here\n    return -1",
            "javascript": "function solve(couponThresholds, cartValue) {\n    // Write your logic here\n    return -1;\n}"
        },
        "solution": {
            "python": "def solve(couponThresholds, cartValue):\n    import bisect\n    idx = bisect.bisect_right(couponThresholds, cartValue) - 1\n    return couponThresholds[idx] if idx >= 0 else -1",
            "javascript": "function solve(couponThresholds, cartValue) {\n    let low = 0, high = couponThresholds.length - 1, best = -1;\n    while (low <= high) {\n        const mid = Math.floor((low + high) / 2);\n        if (couponThresholds[mid] <= cartValue) {\n            best = couponThresholds[mid];\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return best;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        100,
                        250,
                        500,
                        1000
                    ],
                    450
                ],
                "expected": 250,
                "isHidden": false
            },
            {
                "args": [
                    [
                        100,
                        250,
                        500
                    ],
                    50
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-17",
        "company": "zomato",
        "category": "startup",
        "number": 17,
        "title": "Blinkit Cold Storage Temperature Variance Check",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "frequency": "90% in Blinkit IoT",
        "context": "Monitoring ice-cream freezer temperature compliance",
        "fnName": "solve",
        "params": [
            {
                "name": "temps",
                "type": "float[]"
            },
            {
                "name": "k",
                "type": "int"
            },
            {
                "name": "maxVariance",
                "type": "float"
            }
        ],
        "returnType": "bool",
        "description": "Given hourly temperature sensor readings `temps`. Check if every contiguous window of size `k` has `(max(window) - min(window)) <= maxVariance`. Return `true` if safe, else `false`.",
        "constraints": [
            "1 <= k <= temps.length <= 10^5"
        ],
        "hint": "Monotonic deques for max and min over window size k.",
        "starter": {
            "python": "def solve(temps, k, maxVariance):\n    # Write your logic here\n    return False",
            "javascript": "function solve(temps, k, maxVariance) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(temps, k, maxVariance):\n    for i in range(len(temps) - k + 1):\n        win = temps[i : i + k]\n        if max(win) - min(win) > maxVariance + 1e-6:\n            return False\n    return True",
            "javascript": "function solve(temps, k, maxVariance) {\n    for (let i = 0; i <= temps.length - k; i++) {\n        let mn = temps[i], mx = temps[i];\n        for (let j = 1; j < k; j++) {\n            mn = Math.min(mn, temps[i + j]);\n            mx = Math.max(mx, temps[i + j]);\n        }\n        if (mx - mn > maxVariance + 1e-6) return false;\n    }\n    return true;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        -18,
                        -18.2,
                        -17.9,
                        -18.1,
                        -17.8
                    ],
                    3,
                    0.5
                ],
                "expected": true,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-18",
        "company": "zomato",
        "category": "startup",
        "number": 18,
        "title": "Customer Recent Restaurant History (LRU Eviction)",
        "difficulty": "Medium",
        "topic": "Linked List & Hash Map",
        "frequency": "94% in Zomato App",
        "context": "Recently visited restaurants carousel",
        "fnName": "solve",
        "params": [
            {
                "name": "capacity",
                "type": "int"
            },
            {
                "name": "actions",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Simulate a recently viewed restaurant list of max `capacity`. When a restaurant ID is viewed, move it to the most-recent spot. If size exceeds capacity, evict least-recently viewed. Return state from most recent to least recent.",
        "constraints": [
            "1 <= capacity <= 100",
            "1 <= actions.length <= 1000"
        ],
        "hint": "Linked list or array: remove existing instance and unshift to front. Slice to capacity.",
        "starter": {
            "python": "def solve(capacity, actions):\n    # Write your logic here\n    return []",
            "javascript": "function solve(capacity, actions) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(capacity, actions):\n    cache = []\n    for item in actions:\n        if item in cache:\n            cache.remove(item)\n        cache.insert(0, item)\n        if len(cache) > capacity:\n            cache.pop()\n    return cache",
            "javascript": "function solve(capacity, actions) {\n    let cache = [];\n    for (const item of actions) {\n        cache = cache.filter(x => x !== item);\n        cache.unshift(item);\n        if (cache.length > capacity) cache.pop();\n    }\n    return cache;\n}"
        },
        "testCases": [
            {
                "args": [
                    3,
                    [
                        1,
                        2,
                        3,
                        2,
                        4
                    ]
                ],
                "expected": [
                    4,
                    2,
                    3
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-19",
        "company": "zomato",
        "category": "startup",
        "number": 19,
        "title": "Multi-Item Combo Meal Minimum Price",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "92% in Zomato Deals",
        "context": "Finding cheapest combination of individual vs combo prices",
        "fnName": "solve",
        "params": [
            {
                "name": "priceBurger",
                "type": "int"
            },
            {
                "name": "priceFries",
                "type": "int"
            },
            {
                "name": "priceCombo",
                "type": "int"
            },
            {
                "name": "numBurgers",
                "type": "int"
            },
            {
                "name": "numFries",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "One combo includes 1 burger and 1 fries. You can buy individual items or combos. Find minimum cost to purchase at least `numBurgers` and `numFries`.",
        "constraints": [
            "prices >= 0",
            "quantities >= 0"
        ],
        "hint": "Check buying 0 to max(numBurgers, numFries) combos, supplement remainder individually.",
        "starter": {
            "python": "def solve(priceBurger, priceFries, priceCombo, numBurgers, numFries):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(priceBurger, priceFries, priceCombo, numBurgers, numFries) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(priceBurger, priceFries, priceCombo, numBurgers, numFries):\n    min_cost = float('inf')\n    max_combos = max(numBurgers, numFries)\n    for c in range(max_combos + 1):\n        b_needed = max(0, numBurgers - c)\n        f_needed = max(0, numFries - c)\n        cost = c * priceCombo + b_needed * priceBurger + f_needed * priceFries\n        min_cost = min(min_cost, cost)\n    return min_cost",
            "javascript": "function solve(priceBurger, priceFries, priceCombo, numBurgers, numFries) {\n    let minCost = Infinity;\n    const maxCombos = Math.max(numBurgers, numFries);\n    for (let c = 0; c <= maxCombos; c++) {\n        const bNeeded = Math.max(0, numBurgers - c);\n        const fNeeded = Math.max(0, numFries - c);\n        const cost = c * priceCombo + bNeeded * priceBurger + fNeeded * priceFries;\n        minCost = Math.min(minCost, cost);\n    }\n    return minCost;\n}"
        },
        "testCases": [
            {
                "args": [
                    50,
                    30,
                    70,
                    2,
                    3
                ],
                "expected": 190,
                "isHidden": false
            }
        ]
    },
    {
        "id": "zom-20",
        "company": "zomato",
        "category": "startup",
        "number": 20,
        "title": "Live Kitchen Cam Rate Limiter (Token Bucket)",
        "difficulty": "Medium",
        "topic": "Rate Limiting & Token Bucket",
        "frequency": "90% in Zomato Video Streaming",
        "context": "Live food preparation stream rate regulation",
        "fnName": "solve",
        "params": [
            {
                "name": "timestamps",
                "type": "int[]"
            },
            {
                "name": "maxBurst",
                "type": "int"
            },
            {
                "name": "refillRatePerSec",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Token bucket capacity is `maxBurst`. Starts full. At each arrival timestamp, tokens refill by `(time_diff * refillRatePerSec)`. If tokens >= 1, consume 1 and accept. Otherwise drop frame. Return count of accepted frames.",
        "constraints": [
            "1 <= timestamps.length <= 10^5"
        ],
        "hint": "Maintain current token count and last timestamp.",
        "starter": {
            "python": "def solve(timestamps, maxBurst, refillRatePerSec):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(timestamps, maxBurst, refillRatePerSec) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(timestamps, maxBurst, refillRatePerSec):\n    tokens = float(maxBurst)\n    last_t = timestamps[0]\n    accepted = 0\n    for t in timestamps:\n        tokens = min(float(maxBurst), tokens + (t - last_t) * refillRatePerSec)\n        last_t = t\n        if tokens >= 1.0:\n            tokens -= 1.0\n            accepted += 1\n    return accepted",
            "javascript": "function solve(timestamps, maxBurst, refillRatePerSec) {\n    let tokens = maxBurst;\n    let lastT = timestamps[0];\n    let accepted = 0;\n    for (const t of timestamps) {\n        tokens = Math.min(maxBurst, tokens + (t - lastT) * refillRatePerSec);\n        lastT = t;\n        if (tokens >= 1) {\n            tokens -= 1;\n            accepted++;\n        }\n    }\n    return accepted;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        0,
                        0,
                        0,
                        1,
                        1
                    ],
                    2,
                    1
                ],
                "expected": 3,
                "isHidden": false
            }
        ]
    }
];
