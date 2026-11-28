/**
 * AlgoPlay Deterministic Step-Snapshot Execution Engine
 * Every operation on any of the 66 data structures or algorithms compiles a sequence
 * of immutable execution snapshots:
 *   frames = [ { stepIndex, title, detail, pseudoLine, vars, metrics, visualState, error } ]
 *
 * Because every step is stored as a self-contained immutable snapshot:
 *  - Next Step advances to frames[currentStep + 1]
 *  - Previous Step restores frames[currentStep - 1] instantaneously and deterministically
 *  - Play / Pause / Speed (0.5x, 1x, 1.5x, 2x, 3x) steps through the frames array cleanly
 */

const clone = (obj) => JSON.parse(JSON.stringify(obj));

/* =========================================================================
   1. SEARCHING ALGORITHMS STEP GENERATOR (Linear, Binary, Jump, Interpolation, Exponential)
   ========================================================================= */
export const generateSearchingFrames = (variant, rawArray = [], rawTarget = 0) => {
    const target = Number(rawTarget);
    let arr = rawArray.map(Number).filter((n) => !Number.isNaN(n));
    if (arr.length === 0) {
        return [
            {
                title: 'Empty Array Warning',
                detail: 'Cannot search in an empty array (size = 0). Please insert elements or load sample data first.',
                pseudoLine: 0,
                vars: { n: 0, target },
                metrics: { comparisons: 0, accesses: 0 },
                error: 'Empty structure: Array contains 0 elements.',
                visualState: { array: [], activeIndices: [], foundIndex: -1, eliminatedIndices: [], range: null }
            }
        ];
    }

    const frames = [];
    let comparisons = 0;
    let accesses = 0;

    const pushFrame = (title, detail, pseudoLine, extraState = {}, vars = {}, error = null) => {
        frames.push({
            stepIndex: frames.length,
            title,
            detail,
            pseudoLine,
            vars: { target, n: arr.length, ...vars },
            metrics: { comparisons, accesses },
            error,
            visualState: {
                array: [...arr],
                activeIndices: [],
                comparingIndices: [],
                foundIndex: -1,
                eliminatedIndices: [],
                range: null,
                ...extraState
            }
        });
    };

    if (variant === 'linear') {
        pushFrame(
            'Initialize Linear Search',
            `Starting sequential scan from index 0 to ${arr.length - 1} looking for target = ${target}.`,
            0,
            { range: [0, arr.length - 1] },
            { i: 0 }
        );

        for (let i = 0; i < arr.length; i++) {
            comparisons++;
            accesses++;
            const val = arr[i];
            const cmpText = val === target ? 'EQUAL (Match!)' : val < target ? `${val} < ${target}` : `${val} > ${target}`;

            pushFrame(
                `Compare Index i = ${i}`,
                `Inspecting arr[${i}] = ${val} against target = ${target} → ${cmpText}.`,
                2,
                {
                    comparingIndices: [i],
                    eliminatedIndices: Array.from({ length: i }, (_, k) => k),
                    range: [i, arr.length - 1]
                },
                { i, 'arr[i]': val, relation: cmpText }
            );

            if (val === target) {
                pushFrame(
                    `Target Found at Index ${i}!`,
                    `arr[${i}] == ${target} matched after ${comparisons} comparison(s).`,
                    3,
                    {
                        foundIndex: i,
                        eliminatedIndices: Array.from({ length: i }, (_, k) => k)
                    },
                    { i, foundAt: i }
                );
                return frames;
            }
        }

        pushFrame(
            'Target Not Found',
            `Scanned all ${arr.length} elements (${comparisons} comparisons). Target ${target} is not in the array.`,
            4,
            { eliminatedIndices: Array.from({ length: arr.length }, (_, k) => k) },
            { result: -1 },
            `Target ${target} not found in array.`
        );
        return frames;
    }

    // For Binary, Jump, Interpolation, Exponential: check if sorted; auto-sort if unsorted and notify student
    const isSorted = arr.every((v, idx) => idx === 0 || arr[idx - 1] <= v);
    if (!isSorted) {
        const unsortedCopy = [...arr];
        arr = [...arr].sort((a, b) => a - b);
        pushFrame(
            'Prerequisite: Sorted Array Required',
            `${variant.toUpperCase()} Search requires a sorted array! Unsorted input [${unsortedCopy.join(', ')}] was automatically sorted to [${arr.join(', ')}] so interval halving remains valid.`,
            0,
            { range: [0, arr.length - 1] },
            { sorted: 'True (Auto-Sorted)' }
        );
    }

    if (variant === 'binary' || variant === 'exponential' || variant === 'interpolation') {
        let low = 0;
        let high = arr.length - 1;
        const eliminated = new Set();

        if (variant === 'exponential') {
            comparisons++;
            accesses++;
            if (arr[0] === target) {
                pushFrame('Match at Index 0', `arr[0] == ${target} found on initial bound check!`, 0, { foundIndex: 0 }, { bound: 0 });
                return frames;
            }
            let bound = 1;
            while (bound < arr.length && arr[bound] <= target) {
                comparisons++;
                accesses++;
                pushFrame(
                    `Galloping Bound = ${bound}`,
                    `arr[${bound}] = ${arr[bound]} <= ${target}. Doubling bound to ${bound * 2}.`,
                    1,
                    { comparingIndices: [bound], range: [Math.floor(bound / 2), Math.min(bound, arr.length - 1)] },
                    { bound, 'arr[bound]': arr[bound] }
                );
                bound *= 2;
            }
            low = Math.floor(bound / 2);
            high = Math.min(bound, arr.length - 1);
            for (let k = 0; k < low; k++) eliminated.add(k);
            for (let k = high + 1; k < arr.length; k++) eliminated.add(k);

            pushFrame(
                `Binary Search Window [${low} .. ${high}]`,
                `Exponential bound located target window [${low}, ${high}]. Launching Binary Search inside this interval.`,
                2,
                { range: [low, high], eliminatedIndices: [...eliminated] },
                { low, high }
            );
        } else {
            pushFrame(
                `Initialize ${variant === 'interpolation' ? 'Interpolation' : 'Binary'} Search`,
                `Search interval initialized to [low = ${low}, high = ${high}].`,
                0,
                { range: [low, high] },
                { low, high }
            );
        }

        while (low <= high) {
            let mid;
            if (variant === 'interpolation') {
                if (target < arr[low] || target > arr[high]) break;
                if (arr[high] === arr[low]) {
                    mid = low;
                } else {
                    mid = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
                    mid = Math.max(low, Math.min(high, mid));
                }
            } else {
                mid = low + Math.floor((high - low) / 2);
            }

            comparisons++;
            accesses++;
            const midVal = arr[mid];
            const relation =
                midVal === target
                    ? 'EQUAL (Target Found!)'
                    : midVal < target
                    ? `${midVal} < ${target} (Go Right)`
                    : `${midVal} > ${target} (Go Left)`;

            pushFrame(
                `Probe Midpoint Index = ${mid}`,
                `Interval [${low}..${high}] → Probe index ${mid} has value ${midVal}. Compare with ${target}: ${relation}.`,
                2,
                {
                    comparingIndices: [mid],
                    activeIndices: [low, high],
                    range: [low, high],
                    eliminatedIndices: [...eliminated]
                },
                { low, mid, high, 'arr[mid]': midVal }
            );

            if (midVal === target) {
                pushFrame(
                    `Target Found at Index ${mid}!`,
                    `Matched arr[${mid}] == ${target} in ${comparisons} comparison(s) (vs ${mid + 1} in Linear Search).`,
                    3,
                    {
                        foundIndex: mid,
                        range: [mid, mid],
                        eliminatedIndices: [...eliminated]
                    },
                    { low, mid, high, foundAt: mid }
                );
                return frames;
            }

            if (midVal < target) {
                for (let k = low; k <= mid; k++) eliminated.add(k);
                low = mid + 1;
                pushFrame(
                    `Discard Left Half [..${mid}]`,
                    `Since arr[${mid}] = ${midVal} < ${target}, target must lie in right half. Advance low = ${low}.`,
                    4,
                    { range: low <= high ? [low, high] : null, eliminatedIndices: [...eliminated] },
                    { low, high }
                );
            } else {
                for (let k = mid; k <= high; k++) eliminated.add(k);
                high = mid - 1;
                pushFrame(
                    `Discard Right Half [${mid}..]`,
                    `Since arr[${mid}] = ${midVal} > ${target}, target must lie in left half. Retreat high = ${high}.`,
                    4,
                    { range: low <= high ? [low, high] : null, eliminatedIndices: [...eliminated] },
                    { low, high }
                );
            }
        }

        pushFrame(
            'Target Not Found',
            `Search interval exhausted (low > high) after ${comparisons} comparisons. Target ${target} does not exist.`,
            4,
            { eliminatedIndices: Array.from({ length: arr.length }, (_, k) => k) },
            { low, high, result: -1 },
            `Target ${target} not found in sorted array.`
        );
        return frames;
    }

    // Jump Search
    const n = arr.length;
    const m = Math.max(1, Math.floor(Math.sqrt(n)));
    let prev = 0;
    let step = m;
    const eliminated = new Set();

    pushFrame(
        `Initialize Jump Search (Block Size √${n} = ${m})`,
        `Jumping ahead in blocks of size m = ${m} across sorted array.`,
        0,
        { range: [0, Math.min(step, n) - 1] },
        { blockSize: m, prev, step }
    );

    while (prev < n && arr[Math.min(step, n) - 1] < target) {
        comparisons++;
        accesses++;
        const checkIdx = Math.min(step, n) - 1;
        pushFrame(
            `Jump Check at Index ${checkIdx}`,
            `Block end arr[${checkIdx}] = ${arr[checkIdx]} < ${target}. Skipping block [${prev}..${checkIdx}].`,
            1,
            {
                comparingIndices: [checkIdx],
                range: [prev, checkIdx],
                eliminatedIndices: [...eliminated]
            },
            { prev, checkIdx, 'arr[checkIdx]': arr[checkIdx] }
        );
        for (let k = prev; k <= checkIdx; k++) eliminated.add(k);
        prev = step;
        step += m;
        if (prev >= n) break;
    }

    const blockEnd = Math.min(step, n) - 1;
    for (let i = prev; i <= blockEnd; i++) {
        comparisons++;
        accesses++;
        pushFrame(
            `Linear Scan Inside Block: Index ${i}`,
            `Scanning candidate block [${prev}..${blockEnd}]: comparing arr[${i}] = ${arr[i]} with ${target}.`,
            2,
            {
                comparingIndices: [i],
                range: [prev, blockEnd],
                eliminatedIndices: [...eliminated]
            },
            { i, 'arr[i]': arr[i] }
        );
        if (arr[i] === target) {
            pushFrame(
                `Target Found at Index ${i}!`,
                `Jump Search located arr[${i}] == ${target} in ${comparisons} comparisons.`,
                3,
                { foundIndex: i, eliminatedIndices: [...eliminated] },
                { foundAt: i }
            );
            return frames;
        }
        eliminated.add(i);
    }

    pushFrame(
        'Target Not Found',
        `Target ${target} not found in candidate block after ${comparisons} comparisons.`,
        4,
        { eliminatedIndices: Array.from({ length: n }, (_, k) => k) },
        { result: -1 },
        `Target ${target} not found.`
    );
    return frames;
};

/* =========================================================================
   2. SORTING ALGORITHMS STEP GENERATOR (All 10 Sorting Algorithms)
   ========================================================================= */
export const generateSortingFrames = (variant, rawArray = [], order = 'asc') => {
    const arr = rawArray.map(Number).filter((n) => !Number.isNaN(n));
    if (arr.length === 0) {
        return [
            {
                title: 'Empty Array Warning',
                detail: 'Please provide at least 1 number to sort.',
                pseudoLine: 0,
                vars: { n: 0 },
                metrics: { comparisons: 0, swaps: 0, accesses: 0 },
                error: 'Cannot sort an empty array.',
                visualState: { array: [], comparing: [], swapping: [], sorted: [], pivot: -1, tempBuffer: [] }
            }
        ];
    }

    const isAsc = order !== 'desc';
    const shouldSwap = (a, b) => (isAsc ? a > b : a < b);

    const frames = [];
    let comparisons = 0;
    let swaps = 0;
    let accesses = 0;

    const pushFrame = (title, detail, pseudoLine, extra = {}, vars = {}) => {
        frames.push({
            stepIndex: frames.length,
            title,
            detail,
            pseudoLine,
            vars: { n: arr.length, order: isAsc ? 'Ascending' : 'Descending', ...vars },
            metrics: { comparisons, swaps, accesses },
            visualState: {
                array: [...arr],
                comparing: [],
                swapping: [],
                processing: [],
                sorted: [],
                pivot: -1,
                tempBuffer: [],
                buckets: null,
                showHeapTree: variant === 'heap',
                ...extra
            }
        });
    };

    pushFrame(
        `Initialize ${variant.toUpperCase()} Sort`,
        `Starting with ${arr.length} elements: [${arr.join(', ')}] in ${isAsc ? 'Ascending' : 'Descending'} order.`,
        0
    );

    const n = arr.length;

    if (variant === 'bubble') {
        const sortedSet = new Set();
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - 1 - i; j++) {
                comparisons++;
                accesses += 2;
                pushFrame(
                    `Compare Adjacent (${j}, ${j + 1})`,
                    `Comparing arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}.`,
                    2,
                    { comparing: [j, j + 1], sorted: [...sortedSet] },
                    { pass: i + 1, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] }
                );
                if (shouldSwap(arr[j], arr[j + 1])) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swaps++;
                    accesses += 2;
                    swapped = true;
                    pushFrame(
                        `Swap Indices ${j} & ${j + 1}`,
                        `Swapped ${arr[j + 1]} and ${arr[j]} so elements move toward sorted order.`,
                        3,
                        { swapping: [j, j + 1], sorted: [...sortedSet] },
                        { pass: i + 1, j, swapped: 'true' }
                    );
                }
            }
            sortedSet.add(n - 1 - i);
            if (!swapped) {
                for (let k = 0; k < n; k++) sortedSet.add(k);
                pushFrame(
                    'Early Termination — Already Sorted!',
                    `Zero swaps occurred during Pass ${i + 1}. Array is completely sorted!`,
                    4,
                    { sorted: [...sortedSet] },
                    { pass: i + 1, earlyExit: 'true' }
                );
                return frames;
            }
        }
        for (let k = 0; k < n; k++) sortedSet.add(k);
        pushFrame('Bubble Sort Complete', `Finished sorting in ${comparisons} comparisons and ${swaps} swaps.`, 4, {
            sorted: [...sortedSet]
        });
        return frames;
    }

    if (variant === 'selection') {
        const sortedSet = new Set();
        for (let i = 0; i < n - 1; i++) {
            let extIdx = i;
            for (let j = i + 1; j < n; j++) {
                comparisons++;
                accesses += 2;
                pushFrame(
                    `Scan Unsorted Suffix: Compare Index ${j} with Best ${extIdx}`,
                    `Comparing arr[${j}] = ${arr[j]} against current extremal arr[${extIdx}] = ${arr[extIdx]}.`,
                    2,
                    { comparing: [extIdx, j], processing: [i], sorted: [...sortedSet] },
                    { i, j, bestIdx: extIdx, bestVal: arr[extIdx] }
                );
                if (shouldSwap(arr[extIdx], arr[j])) {
                    extIdx = j;
                }
            }
            if (extIdx !== i) {
                [arr[i], arr[extIdx]] = [arr[extIdx], arr[i]];
                swaps++;
                accesses += 2;
                pushFrame(
                    `Swap Extremal into Position ${i}`,
                    `Swapped arr[${i}] and arr[${extIdx}] (${arr[i]} locked at index ${i}).`,
                    3,
                    { swapping: [i, extIdx], sorted: [...sortedSet, i] },
                    { i, swappedWith: extIdx }
                );
            }
            sortedSet.add(i);
        }
        for (let k = 0; k < n; k++) sortedSet.add(k);
        pushFrame('Selection Sort Complete', `Sorted all ${n} elements with only ${swaps} swap(s).`, 4, {
            sorted: [...sortedSet]
        });
        return frames;
    }

    if (variant === 'insertion') {
        const sortedSet = new Set([0]);
        for (let i = 1; i < n; i++) {
            const key = arr[i];
            accesses++;
            let j = i - 1;
            pushFrame(
                `Pick Key arr[${i}] = ${key}`,
                `Inserting key = ${key} into sorted left prefix [0..${i - 1}].`,
                1,
                { processing: [i], sorted: [...sortedSet], tempBuffer: [{ label: 'key', val: key }] },
                { i, key }
            );
            while (j >= 0) {
                comparisons++;
                accesses++;
                if (shouldSwap(arr[j], key)) {
                    arr[j + 1] = arr[j];
                    swaps++;
                    accesses++;
                    pushFrame(
                        `Shift arr[${j}] = ${arr[j]} Right to Index ${j + 1}`,
                        `arr[${j}] (${arr[j]}) precedes key (${key}); shifted right by 1 slot.`,
                        2,
                        { swapping: [j, j + 1], sorted: [...sortedSet], tempBuffer: [{ label: 'key', val: key }] },
                        { i, j, key }
                    );
                    j--;
                } else {
                    break;
                }
            }
            arr[j + 1] = key;
            accesses++;
            sortedSet.add(i);
            pushFrame(
                `Place Key ${key} at Index ${j + 1}`,
                `Prefix [0..${i}] is now in sorted order.`,
                3,
                { processing: [j + 1], sorted: [...sortedSet] },
                { placedAt: j + 1, key }
            );
        }
        pushFrame('Insertion Sort Complete', `All ${n} elements sorted in ${comparisons} comparisons.`, 4, {
            sorted: Array.from({ length: n }, (_, k) => k)
        });
        return frames;
    }

    if (variant === 'shell') {
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            pushFrame(
                `New Shell Stride Gap = ${gap}`,
                `Running gapped insertion pass comparing elements separated by gap = ${gap}.`,
                1,
                {},
                { gap }
            );
            for (let i = gap; i < n; i++) {
                const temp = arr[i];
                let j = i;
                while (j >= gap) {
                    comparisons++;
                    accesses += 2;
                    pushFrame(
                        `Gap-${gap} Compare (${j - gap}, ${j})`,
                        `Comparing arr[${j - gap}] = ${arr[j - gap]} with temp = ${temp}.`,
                        3,
                        { comparing: [j - gap, j], tempBuffer: [{ label: 'temp', val: temp }] },
                        { gap, i, j, temp }
                    );
                    if (shouldSwap(arr[j - gap], temp)) {
                        arr[j] = arr[j - gap];
                        swaps++;
                        pushFrame(
                            `Gap-${gap} Shift Index ${j - gap} → ${j}`,
                            `Moved ${arr[j]} forward by ${gap} positions.`,
                            3,
                            { swapping: [j - gap, j], tempBuffer: [{ label: 'temp', val: temp }] },
                            { gap, j }
                        );
                        j -= gap;
                    } else {
                        break;
                    }
                }
                arr[j] = temp;
            }
        }
        pushFrame('Shell Sort Complete', `Sorted all ${n} elements across decreasing gap strides.`, 4, {
            sorted: Array.from({ length: n }, (_, k) => k)
        });
        return frames;
    }

    if (variant === 'merge') {
        const merge = (l, mid, r) => {
            const leftPart = arr.slice(l, mid + 1);
            const rightPart = arr.slice(mid + 1, r + 1);
            accesses += leftPart.length + rightPart.length;

            pushFrame(
                `Divide & Merge Subarrays [${l}..${mid}] and [${mid + 1}..${r}]`,
                `Merging Left = [${leftPart.join(', ')}] and Right = [${rightPart.join(', ')}].`,
                2,
                {
                    processing: Array.from({ length: r - l + 1 }, (_, k) => l + k),
                    tempBuffer: [...leftPart, ...rightPart].map((v, idx) => ({ label: `tmp[${idx}]`, val: v }))
                },
                { left: l, mid, right: r }
            );

            let i = 0;
            let j = 0;
            let k = l;
            const mergedSoFar = [];

            while (i < leftPart.length && j < rightPart.length) {
                comparisons++;
                const takeLeft = isAsc ? leftPart[i] <= rightPart[j] : leftPart[i] >= rightPart[j];
                const chosen = takeLeft ? leftPart[i++] : rightPart[j++];
                arr[k] = chosen;
                mergedSoFar.push(chosen);
                accesses++;
                swaps++;

                pushFrame(
                    `Merge Write Index ${k} = ${chosen}`,
                    `Placed ${chosen} into arr[${k}] from temporary merge buffer.`,
                    3,
                    {
                        swapping: [k],
                        processing: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
                        tempBuffer: mergedSoFar.map((v, idx) => ({ label: `buf[${idx}]`, val: v }))
                    },
                    { writeIndex: k, val: chosen }
                );
                k++;
            }

            while (i < leftPart.length) {
                arr[k] = leftPart[i++];
                mergedSoFar.push(arr[k]);
                accesses++;
                k++;
            }
            while (j < rightPart.length) {
                arr[k] = rightPart[j++];
                mergedSoFar.push(arr[k]);
                accesses++;
                k++;
            }

            pushFrame(
                `Merged Range [${l}..${r}] Sorted`,
                `Subarray [${l}..${r}] is now sorted: [${arr.slice(l, r + 1).join(', ')}].`,
                4,
                {
                    processing: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
                    sorted: l === 0 && r === n - 1 ? Array.from({ length: n }, (_, idx) => idx) : []
                },
                { range: `[${l}..${r}]` }
            );
        };

        const sortRec = (l, r) => {
            if (l >= r) return;
            const mid = l + Math.floor((r - l) / 2);
            sortRec(l, mid);
            sortRec(mid + 1, r);
            merge(l, mid, r);
        };

        sortRec(0, n - 1);
        pushFrame('Merge Sort Complete', `Guaranteed O(n log n) stable sort finished in ${comparisons} comparisons.`, 4, {
            sorted: Array.from({ length: n }, (_, k) => k)
        });
        return frames;
    }

    if (variant === 'quick') {
        const sortedSet = new Set();

        const partition = (low, high) => {
            const pivotVal = arr[high];
            accesses++;
            let i = low - 1;

            pushFrame(
                `Select Pivot arr[${high}] = ${pivotVal}`,
                `Partitioning subarray [${low}..${high}] around pivot = ${pivotVal}.`,
                0,
                {
                    pivot: high,
                    processing: Array.from({ length: high - low + 1 }, (_, k) => low + k),
                    sorted: [...sortedSet]
                },
                { low, high, pivot: pivotVal }
            );

            for (let j = low; j < high; j++) {
                comparisons++;
                accesses++;
                const goesLeft = isAsc ? arr[j] <= pivotVal : arr[j] >= pivotVal;

                pushFrame(
                    `Compare arr[${j}] = ${arr[j]} with Pivot ${pivotVal}`,
                    goesLeft
                        ? `${arr[j]} belongs on the left side of pivot ${pivotVal}.`
                        : `${arr[j]} stays on the right side of pivot ${pivotVal}.`,
                    1,
                    { comparing: [j, high], pivot: high, sorted: [...sortedSet] },
                    { low, high, i, j, pivot: pivotVal }
                );

                if (goesLeft) {
                    i++;
                    if (i !== j) {
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                        swaps++;
                        accesses += 2;
                        pushFrame(
                            `Swap Partition Elements (${i}, ${j})`,
                            `Moved ${arr[i]} into left partition at index ${i}.`,
                            2,
                            { swapping: [i, j], pivot: high, sorted: [...sortedSet] },
                            { i, j, pivot: pivotVal }
                        );
                    }
                }
            }

            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            swaps++;
            accesses += 2;
            const pivotFinal = i + 1;
            sortedSet.add(pivotFinal);

            pushFrame(
                `Lock Pivot ${pivotVal} at Final Sorted Index ${pivotFinal}`,
                `Pivot ${pivotVal} is now permanently in its final sorted position ${pivotFinal}!`,
                3,
                { swapping: [pivotFinal, high], pivot: pivotFinal, sorted: [...sortedSet] },
                { pivotFinal, pivot: pivotVal }
            );
            return pivotFinal;
        };

        const quickRec = (low, high) => {
            if (low <= high) {
                if (low === high) {
                    sortedSet.add(low);
                    return;
                }
                const p = partition(low, high);
                quickRec(low, p - 1);
                quickRec(p + 1, high);
            }
        };

        quickRec(0, n - 1);
        pushFrame('Quick Sort Complete', `In-place Quick Sort completed in ${comparisons} comparisons and ${swaps} swaps.`, 4, {
            sorted: Array.from({ length: n }, (_, k) => k)
        });
        return frames;
    }

    if (variant === 'heap') {
        const sortedSet = new Set();

        const siftDown = (heapSize, rootIdx) => {
            let extremal = rootIdx;
            const left = 2 * rootIdx + 1;
            const right = 2 * rootIdx + 2;

            if (left < heapSize) {
                comparisons++;
                accesses += 2;
                if (shouldSwap(arr[left], arr[extremal])) extremal = left;
            }
            if (right < heapSize) {
                comparisons++;
                accesses += 2;
                if (shouldSwap(arr[right], arr[extremal])) extremal = right;
            }

            if (extremal !== rootIdx) {
                [arr[rootIdx], arr[extremal]] = [arr[extremal], arr[rootIdx]];
                swaps++;
                accesses += 2;
                pushFrame(
                    `Heapify Sift-Down Swap (${rootIdx} ↔ ${extremal})`,
                    `Swapped parent index ${rootIdx} with child index ${extremal} to restore Heap property.`,
                    3,
                    { swapping: [rootIdx, extremal], sorted: [...sortedSet], showHeapTree: true },
                    { heapSize, parent: rootIdx, child: extremal }
                );
                siftDown(heapSize, extremal);
            }
        };

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            siftDown(n, i);
        }

        pushFrame(
            'Heap Construction Complete',
            `Array is now structured as a valid ${isAsc ? 'Max-Heap' : 'Min-Heap'} with extremal root arr[0] = ${arr[0]}.`,
            0,
            { processing: [0], sorted: [...sortedSet], showHeapTree: true }
        );

        for (let end = n - 1; end > 0; end--) {
            [arr[0], arr[end]] = [arr[end], arr[0]];
            swaps++;
            accesses += 2;
            sortedSet.add(end);
            pushFrame(
                `Extract Heap Root to Sorted Index ${end}`,
                `Swapped root ${arr[end]} into final sorted slot ${end}. Sifting down remaining heap [0..${end - 1}].`,
                2,
                { swapping: [0, end], sorted: [...sortedSet], showHeapTree: true },
                { lockedIndex: end, extractedVal: arr[end] }
            );
            siftDown(end, 0);
        }
        sortedSet.add(0);
        pushFrame('Heap Sort Complete', `O(n log n) in-place Heap Sort finished in ${swaps} swaps.`, 4, {
            sorted: Array.from({ length: n }, (_, k) => k),
            showHeapTree: true
        });
        return frames;
    }

    if (variant === 'counting') {
        const minVal = Math.min(...arr);
        const maxVal = Math.max(...arr);
        const freqMap = new Map();

        for (let i = 0; i < n; i++) {
            accesses++;
            freqMap.set(arr[i], (freqMap.get(arr[i]) || 0) + 1);
            const summary = [...freqMap.entries()]
                .sort((a, b) => a[0] - b[0])
                .map(([k, v]) => ({ label: `val ${k}`, val: `count: ${v}` }));

            pushFrame(
                `Tally Frequency of arr[${i}] = ${arr[i]}`,
                `Incremented count for key ${arr[i]} (now ${freqMap.get(arr[i])}).`,
                1,
                { processing: [i], tempBuffer: summary },
                { i, key: arr[i], minVal, maxVal }
            );
        }

        const distinctSorted = [...freqMap.keys()].sort((a, b) => (isAsc ? a - b : b - a));
        let writeIdx = 0;
        const sortedSet = new Set();

        for (const key of distinctSorted) {
            const count = freqMap.get(key);
            for (let c = 0; c < count; c++) {
                arr[writeIdx] = key;
                accesses++;
                swaps++;
                sortedSet.add(writeIdx);
                pushFrame(
                    `Reconstruct Output: Write ${key} at Index ${writeIdx}`,
                    `Writing key ${key} from frequency bucket into arr[${writeIdx}].`,
                    3,
                    {
                        swapping: [writeIdx],
                        sorted: [...sortedSet],
                        tempBuffer: distinctSorted.map((k) => ({ label: `key ${k}`, val: `×${freqMap.get(k)}` }))
                    },
                    { writeIdx, key }
                );
                writeIdx++;
            }
        }
        pushFrame('Counting Sort Complete', `Non-comparison linear sort completed with 0 element-to-element comparisons!`, 4, {
            sorted: Array.from({ length: n }, (_, k) => k)
        });
        return frames;
    }

    if (variant === 'radix') {
        const minOffset = Math.min(0, ...arr);
        const shifted = arr.map((v) => v - minOffset);
        const maxVal = Math.max(...shifted, 1);

        for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
            const buckets = Array.from({ length: 10 }, () => []);
            for (let i = 0; i < n; i++) {
                accesses++;
                const d = Math.floor(shifted[i] / exp) % 10;
                buckets[d].push(arr[i]);
            }

            const bucketOrder = isAsc ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] : [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
            const bucketPreview = bucketOrder
                .filter((b) => buckets[b].length > 0)
                .map((b) => ({ label: `Digit ${b}`, val: buckets[b].join(', ') }));

            pushFrame(
                `Distribute by Place Value (exp = ${exp})`,
                `Grouped elements into 10 digit buckets by their ${exp}s place digit.`,
                2,
                { tempBuffer: bucketPreview },
                { placeValue: exp }
            );

            let idx = 0;
            for (const b of bucketOrder) {
                for (const val of buckets[b]) {
                    arr[idx] = val;
                    shifted[idx] = val - minOffset;
                    swaps++;
                    accesses++;
                    idx++;
                }
            }

            pushFrame(
                `Collect Buckets for Place Value ${exp}`,
                `Array after ${exp}s digit stable pass: [${arr.join(', ')}].`,
                4,
                { processing: Array.from({ length: n }, (_, k) => k), tempBuffer: bucketPreview },
                { placeValue: exp }
            );
        }

        pushFrame('Radix Sort Complete', `LSD Radix Sort completed across all digit positions.`, 4, {
            sorted: Array.from({ length: n }, (_, k) => k)
        });
        return frames;
    }

    // Bucket Sort
    const minVal = Math.min(...arr);
    const maxVal = Math.max(...arr);
    const bucketCount = Math.max(2, Math.min(5, Math.ceil(Math.sqrt(n))));
    const span = Math.max(1, maxVal - minVal + 1);
    const buckets = Array.from({ length: bucketCount }, () => []);

    for (let i = 0; i < n; i++) {
        accesses++;
        let bIdx = Math.min(bucketCount - 1, Math.floor(((arr[i] - minVal) / span) * bucketCount));
        if (!isAsc) bIdx = bucketCount - 1 - bIdx;
        buckets[bIdx].push(arr[i]);

        pushFrame(
            `Scatter arr[${i}] = ${arr[i]} → Bucket #${bIdx}`,
            `Distributed ${arr[i]} into range Bucket #${bIdx}.`,
            1,
            {
                processing: [i],
                tempBuffer: buckets.map((b, idx) => ({ label: `Bucket #${idx}`, val: b.join(', ') || 'empty' }))
            },
            { item: arr[i], bucket: bIdx }
        );
    }

    let writeIdx = 0;
    const sortedSet = new Set();
    for (let b = 0; b < bucketCount; b++) {
        buckets[b].sort((x, y) => (isAsc ? x - y : y - x));
        comparisons += Math.max(0, buckets[b].length - 1);
        for (const val of buckets[b]) {
            arr[writeIdx] = val;
            swaps++;
            sortedSet.add(writeIdx);
            pushFrame(
                `Gather Sorted Bucket #${b} → arr[${writeIdx}] = ${val}`,
                `Sorted Bucket #${b} and placed ${val} into arr[${writeIdx}].`,
                3,
                {
                    swapping: [writeIdx],
                    sorted: [...sortedSet],
                    tempBuffer: buckets.map((bk, idx) => ({ label: `Bucket #${idx}`, val: bk.join(', ') || 'empty' }))
                },
                { bucket: b, writeIdx, val }
            );
            writeIdx++;
        }
    }

    pushFrame('Bucket Sort Complete', `Scatter-Sort-Gather completed for all ${n} elements.`, 4, {
        sorted: Array.from({ length: n }, (_, k) => k)
    });
    return frames;
};

export {
    generateLinearDsFrames,
    buildTreeVisualLayout,
    generateTreeAndAdvancedFrames,
    DEFAULT_GRAPH_STATE,
    computeGraphRepresentations,
    generateGraphFrames,
    generateAlgorithmFrames
} from './algoPlayEnginesPart2';

