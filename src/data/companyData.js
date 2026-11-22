/**
 * companyData.js
 * 
 * Target Company Track Catalog for LMS Company-Wise Questions Arena
 */

export const COMPANY_CATEGORIES = [
    { id: 'all', label: 'All Companies', count: 22, icon: 'Building2' },
    { id: 'service', label: 'Service-Based Giants', count: 5, icon: 'Briefcase', desc: 'TCS, Infosys, Accenture, Wipro, Cognizant' },
    { id: 'product', label: 'Product-Based Leaders', count: 10, icon: 'Cpu', desc: 'Amazon, Microsoft, Google, Meta, Apple, Netflix, Adobe, Flipkart, Uber, Atlassian' },
    { id: 'startup', label: 'Next-Gen Startups', count: 4, icon: 'Flame', desc: 'Swiggy, Zomato, Razorpay, PhonePe' },
    { id: 'misc', label: 'FinTech & Specialized', count: 3, icon: 'Layers', desc: 'Goldman Sachs, JPMorgan Chase, Zoho' }
];

export const COMPANIES_CATALOG = [
    // -------------------------------------------------------------------------
    // 1. SERVICE-BASED GIANTS
    // -------------------------------------------------------------------------
    {
        id: 'tcs',
        name: 'TCS',
        fullName: 'Tata Consultancy Services',
        category: 'service',
        categoryLabel: 'Service-Based',
        tagline: 'TCS NQT Ninja, Digital & Prime Tracks',
        packageRange: '3.36 – 9.0 LPA',
        accentColor: '#0F4C81',
        badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
        totalQuestions: 20,
        focusAreas: ['Arrays & Strings', 'Modular Arithmetic', 'Bit Manipulation', 'Number Theory', 'Equilibrium'],
        description: 'Authentic 20 most repeated coding problems from TCS National Qualifier Test (NQT), Digital Round, and Prime selection drives.'
    },
    {
        id: 'infosys',
        name: 'Infosys',
        fullName: 'Infosys SP & DSE',
        category: 'service',
        categoryLabel: 'Service-Based',
        tagline: 'Specialist Programmer (SP) & DSE Assessment',
        packageRange: '3.6 – 9.5 LPA',
        accentColor: '#007CC3',
        badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
        totalQuestions: 20,
        focusAreas: ['Greedy Strategies', 'Dynamic Programming', 'Graph Basics', 'Monster Battles', 'Knapsack'],
        description: 'High-frequency challenges asked in InfyTQ, HackWithInfy, and Specialist Programmer (DSE/SP) coding rounds.'
    },
    {
        id: 'accenture',
        name: 'Accenture',
        fullName: 'Accenture Technology',
        category: 'service',
        categoryLabel: 'Service-Based',
        tagline: 'Associate Software Engineer (ASE) & FSE Tracks',
        packageRange: '4.5 – 6.5 LPA',
        accentColor: '#A100FF',
        badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
        totalQuestions: 20,
        focusAreas: ['Binary String Logic', 'Array Manipulations', 'Inversion Counts', 'Password Validators', 'Spiral Order'],
        description: 'Official pattern coding challenges tested in Accenture On-Campus and Off-Campus National Hiring assessments.'
    },
    {
        id: 'wipro',
        name: 'Wipro',
        fullName: 'Wipro Technologies',
        category: 'service',
        categoryLabel: 'Service-Based',
        tagline: 'Elite National Talent Hunt (NLTH) & Turbo',
        packageRange: '3.5 – 6.5 LPA',
        accentColor: '#E11D48',
        badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
        totalQuestions: 20,
        focusAreas: ['Digit Sum Series', 'Hill Weights', 'Prime Filtering', 'Palindrome Checks', 'String Pin Generators'],
        description: 'Top recurring algorithmic questions asked in Wipro Elite NLTH, Turbo, and Star coding examinations.'
    },
    {
        id: 'cognizant',
        name: 'Cognizant',
        fullName: 'Cognizant Technology Solutions',
        category: 'service',
        categoryLabel: 'Service-Based',
        tagline: 'GenC, GenC Next & GenC Elevate',
        packageRange: '4.0 – 6.75 LPA',
        accentColor: '#0033A0',
        badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
        totalQuestions: 20,
        focusAreas: ['Sliding Windows', 'Two Pointers', 'Rainwater Trapping', 'Next Greater Element', 'Anagram Groups'],
        description: 'Core DSA problems repeatedly evaluated in Cognizant GenC Next and GenC Elevate recruitment examinations.'
    },

    // -------------------------------------------------------------------------
    // 2. PRODUCT-BASED LEADERS
    // -------------------------------------------------------------------------
    {
        id: 'amazon',
        name: 'Amazon',
        fullName: 'Amazon Development Centre',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'SDE-1 Online Assessment (OA) & Onsite',
        packageRange: '28 – 45 LPA',
        accentColor: '#FF9900',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['Priority Queue Heaps', 'LRU Caching', 'Interval Merging', 'Koko Binary Search', 'Island Traversal'],
        description: 'The definitive top 20 most frequently repeated problems from Amazon SDE-1 Online Assessments (OA) and Bar Raiser rounds.'
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        fullName: 'Microsoft Corporation',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'Software Engineer (SWE) Campus & Codility',
        packageRange: '24 – 42 LPA',
        accentColor: '#00A4EF',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['Linked List Reversals', 'BST Validation', 'Matrix Zeroing', 'Rotated Binary Search', 'Boundary Traversal'],
        description: 'Classic Codility and onsite technical challenges tested for Microsoft IDC and University Graduate positions.'
    },
    {
        id: 'google',
        name: 'Google',
        fullName: 'Google LLC',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'Software Engineer L3 & Snapshot OA',
        packageRange: '32 – 55 LPA',
        accentColor: '#4285F4',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['Minimax Binary Search', 'Interval DP', 'Alien Dictionary', 'Sliding Window Substring', '2D Bit Trees'],
        description: 'Curated 20 highest-rated interview and Online Challenge (Snapshot) algorithmic questions from Google engineering rounds.'
    },
    {
        id: 'meta',
        name: 'Meta',
        fullName: 'Meta Platforms, Inc.',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'Software Engineer E3 / E4 Phone Screen & Onsite',
        packageRange: '34 – 58 LPA',
        accentColor: '#0668E1',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['Monotonic Stack', 'Two Pointers', 'Prefix Sum', 'Sparse Vectors', 'Path Parsing'],
        description: 'Top 20 high-frequency Meta coding interview questions covering strings, stacks, prefix sums, and interval intersections.'
    },
    {
        id: 'apple',
        name: 'Apple',
        fullName: 'Apple Inc.',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'Core OS, iOS & Silicon Engineering Rounds',
        packageRange: '30 – 52 LPA',
        accentColor: '#111827',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['2D Matrix Search', 'Bit Manipulation', 'Greedy', 'Cycle Detection', 'Task Scheduling'],
        description: 'Authentic 20 coding challenges frequently tested across Apple SWE, Core OS, and hardware-software systems interviews.'
    },
    {
        id: 'netflix',
        name: 'Netflix',
        fullName: 'Netflix, Inc.',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'Streaming Platform & Content Engineering',
        packageRange: '36 – 60 LPA',
        accentColor: '#E50914',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['Sliding Window', 'LRU / LFU Cache', 'Time-Series KV', 'Binary Search', 'Greedy'],
        description: 'Real-world media streaming, CDN telemetry, rate-limiting, and caching problems asked in Netflix engineering loops.'
    },
    {
        id: 'adobe',
        name: 'Adobe',
        fullName: 'Adobe Inc.',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'MTS-1 / SDE-1 Campus & Creative Cloud',
        packageRange: '22 – 40 LPA',
        accentColor: '#FF0000',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['Sieve & Primes', 'Interval DP', 'N-Queens', 'Celebrity Problem', '2D Submatrices'],
        description: 'Most repeated Adobe India MTS & SDE-1 OA and technical round questions on DP, number theory, and matrix logic.'
    },
    {
        id: 'flipkart',
        name: 'Flipkart',
        fullName: 'Flipkart Internet Pvt. Ltd.',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'Flipkart Grid & SDE-1 Hiring Challenge',
        packageRange: '24 – 38 LPA',
        accentColor: '#2874F0',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['Binary Search Answer', 'Monotonic Stack', 'Shortest Path BFS', 'Job Sequencing', 'Prefix XOR'],
        description: 'Top 20 Flipkart Grid and campus SDE-1 problems covering Aggressive Cows, Painter Partition, Histograms, and Graph BFS.'
    },
    {
        id: 'uber',
        name: 'Uber',
        fullName: 'Uber Technologies',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'Maps, Dispatch & Marketplace SDE-1',
        packageRange: '32 – 54 LPA',
        accentColor: '#000000',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['Shortest Path Graphs', 'Union-Find MST', 'Multi-Source BFS', 'Sweep Line', 'Geo-Grid DFS'],
        description: 'Real Uber OA and onsite problems focused on routing, car pooling, bus transfers, city graphs, and spatial clustering.'
    },
    {
        id: 'atlassian',
        name: 'Atlassian',
        fullName: 'Atlassian Corporation',
        category: 'product',
        categoryLabel: 'Product-Based',
        tagline: 'P3 / P4 Coding & Machine Design Rounds',
        packageRange: '30 – 50 LPA',
        accentColor: '#0052CC',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        totalQuestions: 20,
        focusAreas: ['Ranked Voting', 'File Collections', 'Rate Limiters', 'Org Tree DFS', 'Bitmask Seating'],
        description: 'Classic Atlassian practical coding problems including Rank Teams by Votes, File Collection Top-K, and Logger Rate Limiter.'
    },

    // -------------------------------------------------------------------------
    // 3. NEXT-GEN UNICORN STARTUPS
    // -------------------------------------------------------------------------
    {
        id: 'swiggy',
        name: 'Swiggy',
        fullName: 'Swiggy (Bundl Technologies)',
        category: 'startup',
        categoryLabel: 'Unicorn Startup',
        tagline: 'SDE-1 Backend & Logistics Engineering',
        packageRange: '18 – 34 LPA',
        accentColor: '#FC8019',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        totalQuestions: 20,
        focusAreas: ['Delivery Routing', 'Token Rate Limiting', 'Order Batching', 'Surge Multipliers', 'Geo Distance'],
        description: 'Real-world hyper-local logistics, rate-limiting, and graph optimization problems asked in Swiggy engineering interviews.'
    },
    {
        id: 'zomato',
        name: 'Zomato',
        fullName: 'Zomato Limited',
        category: 'startup',
        categoryLabel: 'Unicorn Startup',
        tagline: 'Product Engineer & Backend Platform',
        packageRange: '16 – 32 LPA',
        accentColor: '#E23744',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        totalQuestions: 20,
        focusAreas: ['Table Booking Overlaps', 'Loyalty Coin Expiry', 'Dining Bill Split', 'Chef Workload Balance', 'K-Means Hubs'],
        description: 'Industry-standard dining reservations, geofencing, and algorithmic batching challenges tested by Zomato tech panels.'
    },
    {
        id: 'razorpay',
        name: 'Razorpay',
        fullName: 'Razorpay Software Private Limited',
        category: 'startup',
        categoryLabel: 'Unicorn Startup',
        tagline: 'Payments Infrastructure & Platform Engineer',
        packageRange: '20 – 36 LPA',
        accentColor: '#0C83FD',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        totalQuestions: 20,
        focusAreas: ['Exponential Backoff', 'Idempotency Dedup', 'Luhn Algorithm', 'Arbitrage Graph Paths', 'Settlement Chunks'],
        description: 'Critical high-throughput fintech problems asked in Razorpay backend, payment gateway, and core platform hiring.'
    },
    {
        id: 'phonepe',
        name: 'PhonePe',
        fullName: 'PhonePe Private Limited',
        category: 'startup',
        categoryLabel: 'Unicorn Startup',
        tagline: 'Payments Scale & SDE-1 Backend',
        packageRange: '22 – 38 LPA',
        accentColor: '#5F259F',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        totalQuestions: 20,
        focusAreas: ['Coin Change DP', 'Sliding Window', 'Modulo Prefix', 'Greedy Scheduling', 'State Machines'],
        description: 'Top 20 high-frequency coding problems from PhonePe SDE-1 Online Assessments and technical interviews.'
    },

    // -------------------------------------------------------------------------
    // 4. FINTECH & SPECIALIZED TECH
    // -------------------------------------------------------------------------
    {
        id: 'goldman-sachs',
        name: 'Goldman Sachs',
        fullName: 'Goldman Sachs Services',
        category: 'misc',
        categoryLabel: 'FinTech Giant',
        tagline: 'Quantitative & Core Technology Analyst',
        packageRange: '22 – 38 LPA',
        accentColor: '#1E3A8A',
        badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
        totalQuestions: 20,
        focusAreas: ['Stock Span Stacks', 'Knight Chessboard Prob', 'Recurring Fraction', '2D Kadane Submatrix', 'Median of Arrays'],
        description: 'High-frequency algorithmic quant and systems challenges repeatedly asked on CoderPad and Goldman Sachs Hackerrank rounds.'
    },
    {
        id: 'jpmorgan',
        name: 'JPMorgan Chase',
        fullName: 'JPMorgan Chase & Co.',
        category: 'misc',
        categoryLabel: 'FinTech Giant',
        tagline: 'Software Engineer Program (SEP) & Code for Good',
        packageRange: '17 – 28 LPA',
        accentColor: '#005EB8',
        badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
        totalQuestions: 20,
        focusAreas: ['Cash Flow Simplification', 'Ledger Balancing', 'Arbitrage Triangular', 'Queue Simulation', 'Tax Computation'],
        description: 'Top recurring technical problems from JPMorgan Chase Code for Good hackathons and SEP technical interviews.'
    },
    {
        id: 'zoho',
        name: 'Zoho',
        fullName: 'Zoho Corporation',
        category: 'misc',
        categoryLabel: 'Specialized Tech',
        tagline: 'Software Developer (Round 2 & 3 Machine Coding)',
        packageRange: '6.0 – 12 LPA',
        accentColor: '#007BFF',
        badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
        totalQuestions: 20,
        focusAreas: ['Custom String Parsing', 'Snake Matrix', 'Math Expression Solver', 'Alternate Sorting', 'Large Number Sum'],
        description: 'Renowned Zoho Round 2 & Round 3 programming challenges where students must code pure logic without built-in library shortcuts.'
    }
];

export const getCompanyById = (id) => {
    return COMPANIES_CATALOG.find((c) => c.id === id) || COMPANIES_CATALOG[0];
};

