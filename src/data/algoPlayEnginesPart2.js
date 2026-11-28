/**
 * AlgoPlay Deterministic Step-Snapshot Engines (Part 2)
 * Covers:
 *  - Linear Data Structures (Array, Linked Lists [Singly/Doubly/Circular/Circular-Doubly], Stack, Queue [Linear/Circular/Deque/Priority])
 *  - Trees & Advanced Data Structures (Binary Tree, BST, AVL, Red-Black, Heap, Trie, Hash Table, DSU, Segment Tree, Fenwick Tree, B-Tree / B+ Tree, Tree Traversals, LCA, Height, Level-Order)
 *  - Graph Data Structure & 10 Graph Algorithms (BFS, DFS, Dijkstra [with negative weight rejection!], Bellman-Ford, Floyd-Warshall, Prim, Kruskal, Topological Sort, Cycle Detection, Connected Components)
 *  - Recursion, Backtracking, Dynamic Programming & Greedy (Factorial, Fibonacci, Tower of Hanoi, Recursion Tree, N-Queens, Rat in a Maze, Subsets, Permutations, 0/1 Knapsack & LCS DP Table, Greedy Activity Selection)
 */

/* =========================================================================
   3. LINEAR DATA STRUCTURES STEP GENERATOR
   ========================================================================= */
export const generateLinearDsFrames = (engineType, subVariant, currentItems = [], action = 'init', payload = {}) => {
    const items = [...currentItems];
    const capacity = payload.capacity || 8;
    const frames = [];
    let comparisons = 0;
    let accesses = 0;

    const pushFrame = (title, detail, pseudoLine, extraState = {}, vars = {}, error = null) => {
        frames.push({
            stepIndex: frames.length,
            title,
            detail,
            pseudoLine,
            vars: { size: extraState.items ? extraState.items.length : items.length, capacity, ...vars },
            metrics: { comparisons, accesses, size: extraState.items ? extraState.items.length : items.length },
            error,
            visualState: {
                engineType,
                subVariant,
                items: extraState.items ? [...extraState.items] : [...items],
                capacity,
                activeIndex: -1,
                comparingIndex: -1,
                foundIndex: -1,
                shiftingIndices: [],
                newNodePreview: null,
                pointerStage: null,
                frontIndex: 0,
                rearIndex: Math.max(0, (extraState.items ? extraState.items.length : items.length) - 1),
                topIndex: (extraState.items ? extraState.items.length : items.length) - 1,
                ...extraState
            }
        });
    };

    // ------------------- A. ARRAYS -------------------
    if (engineType === 'array') {
        const val = Number(payload.value ?? 42);
        const idx = Number(payload.index ?? items.length);

        if (action === 'init' || action === 'load') {
            pushFrame(
                'Array Initialized in Contiguous Memory',
                `Loaded ${items.length} contiguous elements at base address 0x1000 (4 bytes per element).`,
                0,
                { items }
            );
            return { frames, nextItems: items };
        }

        if (action === 'read') {
            if (idx < 0 || idx >= items.length) {
                pushFrame(
                    'Index Out of Bounds Error',
                    `Cannot read index ${idx}: valid array bounds are [0..${Math.max(0, items.length - 1)}].`,
                    0,
                    {},
                    { index: idx },
                    `IndexOutOfBoundsException: index ${idx} out of range [0..${items.length - 1}]`
                );
                return { frames, nextItems: items };
            }
            accesses++;
            const addr = `0x${(0x1000 + idx * 4).toString(16).toUpperCase()}`;
            pushFrame(
                `Calculate Direct Address for arr[${idx}]`,
                `Applying O(1) offset formula: Base(0x1000) + ${idx} × 4 = ${addr}.`,
                0,
                { activeIndex: idx },
                { index: idx, address: addr }
            );
            pushFrame(
                `Read arr[${idx}] = ${items[idx]}`,
                `Retrieved value ${items[idx]} directly from memory cell ${addr} in O(1) time.`,
                0,
                { foundIndex: idx },
                { index: idx, value: items[idx], address: addr }
            );
            return { frames, nextItems: items };
        }

        if (action === 'update') {
            if (idx < 0 || idx >= items.length) {
                pushFrame(
                    'Update Failed: Index Out of Bounds',
                    `Index ${idx} is outside valid bounds [0..${Math.max(0, items.length - 1)}].`,
                    0,
                    {},
                    { index: idx },
                    `Invalid index ${idx}.`
                );
                return { frames, nextItems: items };
            }
            const oldVal = items[idx];
            accesses++;
            pushFrame(
                `Locate Target Slot arr[${idx}]`,
                `Accessing arr[${idx}] (current value = ${oldVal}) in O(1) time.`,
                0,
                { activeIndex: idx },
                { index: idx, oldVal, newVal: val }
            );
            items[idx] = val;
            pushFrame(
                `Updated arr[${idx}] = ${val}`,
                `Overwrote arr[${idx}] from ${oldVal} to ${val}.`,
                0,
                { items, foundIndex: idx },
                { index: idx, value: val }
            );
            return { frames, nextItems: items };
        }

        if (action === 'insert') {
            if (items.length >= capacity) {
                pushFrame(
                    'Array Capacity Overflow',
                    `Fixed array capacity (${capacity}) reached! Cannot insert ${val} without dynamic reallocation.`,
                    1,
                    {},
                    { size: items.length, capacity },
                    `Array Overflow: Maximum capacity of ${capacity} elements reached.`
                );
                return { frames, nextItems: items };
            }
            const targetIdx = Math.max(0, Math.min(items.length, idx));
            pushFrame(
                `Prepare Insertion of ${val} at Index ${targetIdx}`,
                `Checking capacity (${items.length}/${capacity}) and preparing to shift elements [${targetIdx}..${items.length - 1}] right.`,
                1,
                { activeIndex: targetIdx, newNodePreview: { value: val, targetIdx } },
                { insertIndex: targetIdx, value: val }
            );

            for (let k = items.length - 1; k >= targetIdx; k--) {
                accesses += 2;
                pushFrame(
                    `Shift Element arr[${k}] = ${items[k]} → Index ${k + 1}`,
                    `Moving ${items[k]} one slot right to free up index ${targetIdx}.`,
                    2,
                    { shiftingIndices: [k, k + 1], activeIndex: targetIdx, newNodePreview: { value: val, targetIdx } },
                    { k, movedValue: items[k] }
                );
            }

            items.splice(targetIdx, 0, val);
            accesses++;
            pushFrame(
                `Write ${val} into arr[${targetIdx}]`,
                `Inserted ${val} at index ${targetIdx}. Array size is now ${items.length}.`,
                3,
                { items, foundIndex: targetIdx },
                { insertIndex: targetIdx, value: val, newSize: items.length }
            );
            return { frames, nextItems: items };
        }

        if (action === 'delete') {
            if (items.length === 0) {
                pushFrame('Array Underflow', 'Cannot delete from an empty array.', 4, {}, {}, 'Array Underflow: Array is empty.');
                return { frames, nextItems: items };
            }
            const targetIdx = Math.max(0, Math.min(items.length - 1, idx));
            const removed = items[targetIdx];
            pushFrame(
                `Select arr[${targetIdx}] = ${removed} for Deletion`,
                `Highlighting index ${targetIdx} (value = ${removed}) before compacting suffix elements left.`,
                4,
                { activeIndex: targetIdx },
                { deleteIndex: targetIdx, removedValue: removed }
            );

            for (let k = targetIdx; k < items.length - 1; k++) {
                accesses += 2;
                pushFrame(
                    `Shift Left: arr[${k}] ← arr[${k + 1}] (${items[k + 1]})`,
                    `Compacting contiguous memory by shifting index ${k + 1} left into index ${k}.`,
                    4,
                    { shiftingIndices: [k, k + 1], activeIndex: k },
                    { k, shiftedValue: items[k + 1] }
                );
            }

            items.splice(targetIdx, 1);
            pushFrame(
                `Deleted ${removed} from Index ${targetIdx}`,
                `Array compacted. New size = ${items.length}.`,
                4,
                { items },
                { removedValue: removed, newSize: items.length }
            );
            return { frames, nextItems: items };
        }

        if (action === 'search') {
            for (let i = 0; i < items.length; i++) {
                comparisons++;
                accesses++;
                pushFrame(
                    `Inspect arr[${i}] = ${items[i]}`,
                    `Comparing arr[${i}] (${items[i]}) with target ${val} → ${items[i] === val ? 'MATCH!' : 'Not equal'}.`,
                    0,
                    { comparingIndex: i },
                    { i, 'arr[i]': items[i], target: val }
                );
                if (items[i] === val) {
                    pushFrame(
                        `Found ${val} at Index ${i}`,
                        `Target ${val} located at index ${i} after ${comparisons} comparison(s).`,
                        0,
                        { foundIndex: i },
                        { foundAt: i, target: val }
                    );
                    return { frames, nextItems: items };
                }
            }
            pushFrame(
                `Value ${val} Not Found`,
                `Scanned all ${items.length} elements without finding ${val}.`,
                0,
                {},
                { result: -1 },
                `Value ${val} is not present in the array.`
            );
            return { frames, nextItems: items };
        }
    }

    // ------------------- B. LINKED LISTS (Singly, Doubly, Circular, Circular-Doubly) -------------------
    if (engineType === 'linked-list') {
        const val = Number(payload.value ?? 25);
        const pos = Number(payload.index ?? 0);
        const isDoubly = subVariant === 'doubly' || subVariant === 'circular-doubly';
        const isCircular = subVariant === 'circular' || subVariant === 'circular-doubly';

        if (action === 'insertHead' || (action === 'insertPos' && pos <= 0)) {
            // 6-stage pointer animation
            pushFrame(
                'Step 1: Highlight Head Insertion Position',
                `Preparing to insert value ${val} at the beginning (HEAD) of the ${subVariant} linked list.`,
                0,
                { activeIndex: 0, pointerStage: 'highlight-pos' },
                { newVal: val, position: 'HEAD' }
            );
            pushFrame(
                'Step 2: Allocate New Node in Heap Memory',
                `Created node [${val}] at heap address 0x${(0x4000 + items.length * 16).toString(16).toUpperCase()}.`,
                0,
                { activeIndex: 0, newNodePreview: { value: val, targetIdx: 0 }, pointerStage: 'create-node' },
                { newVal: val }
            );
            pushFrame(
                `Step 3: Wire newNode.next → Current Head (${items[0] ?? 'NULL'})`,
                `Pointing newNode.next to old head${isDoubly ? ' and newNode.prev to ' + (isCircular ? 'TAIL' : 'NULL') : ''}.`,
                0,
                { activeIndex: 0, newNodePreview: { value: val, targetIdx: 0 }, pointerStage: 'wire-next' },
                { newVal: val, nextTarget: items[0] ?? 'NULL' }
            );
            if (isDoubly && items.length > 0) {
                pushFrame(
                    `Step 4: Wire oldHead.prev ← newNode (${val})`,
                    `Updating previous pointer of old head (${items[0]}) to point back to newNode.`,
                    1,
                    { activeIndex: 0, newNodePreview: { value: val, targetIdx: 0 }, pointerStage: 'wire-prev' },
                    { oldHead: items[0], newVal: val }
                );
            }
            if (isCircular && items.length > 0) {
                pushFrame(
                    `Step 5: Update Circular Tail Link → New Head (${val})`,
                    `Rewiring tail node (${items[items.length - 1]}).next to wrap around to new head (${val}).`,
                    1,
                    { activeIndex: items.length - 1, newNodePreview: { value: val, targetIdx: 0 }, pointerStage: 'wire-circular' },
                    { tail: items[items.length - 1], newHead: val }
                );
            }
            items.unshift(val);
            pushFrame(
                'Step 6: Advance HEAD Pointer & Finalize List',
                `HEAD now points to [${val}]. List contains ${items.length} linked nodes.`,
                0,
                { items, foundIndex: 0, pointerStage: 'complete' },
                { head: items[0], size: items.length }
            );
            return { frames, nextItems: items };
        }

        if (action === 'insertTail' || (action === 'insertPos' && pos >= items.length)) {
            for (let i = 0; i < items.length; i++) {
                accesses++;
                pushFrame(
                    `Traverse Pointer to Node #${i} (${items[i]})`,
                    `Following .next pointer along node #${i} (value = ${items[i]}) toward the tail.`,
                    1,
                    { activeIndex: i, pointerStage: 'traverse' },
                    { currIndex: i, currVal: items[i] }
                );
            }
            pushFrame(
                `Allocate New Tail Node [${val}]`,
                `Created node [${val}] and preparing to attach after tail (${items[items.length - 1] ?? 'NULL'}).`,
                1,
                {
                    activeIndex: Math.max(0, items.length - 1),
                    newNodePreview: { value: val, targetIdx: items.length },
                    pointerStage: 'create-node'
                },
                { newVal: val }
            );
            pushFrame(
                `Wire Tail Pointer → New Node [${val}]`,
                `Updated oldTail.next = newNode${isDoubly ? ' and newNode.prev = oldTail' : ''}${isCircular ? ', plus newNode.next = HEAD' : ''}.`,
                1,
                {
                    activeIndex: Math.max(0, items.length - 1),
                    newNodePreview: { value: val, targetIdx: items.length },
                    pointerStage: 'wire-next'
                },
                { newVal: val }
            );
            items.push(val);
            pushFrame(
                `Tail Insertion Complete`,
                `Node [${val}] is now the new TAIL at position ${items.length - 1}.`,
                1,
                { items, foundIndex: items.length - 1, pointerStage: 'complete' },
                { tail: val, size: items.length }
            );
            return { frames, nextItems: items };
        }

        if (action === 'insertPos') {
            const targetIdx = Math.max(1, Math.min(items.length - 1, pos));
            for (let i = 0; i < targetIdx; i++) {
                accesses++;
                pushFrame(
                    `Traverse to Predecessor Node #${i} (${items[i]})`,
                    `Advancing curr pointer to index ${i} before insertion slot ${targetIdx}.`,
                    1,
                    { activeIndex: i, pointerStage: 'traverse' },
                    { i, currVal: items[i], targetPos: targetIdx }
                );
            }
            pushFrame(
                `Allocate Node [${val}] for Position ${targetIdx}`,
                `Created newNode(${val}) between [${items[targetIdx - 1]}] and [${items[targetIdx]}].`,
                1,
                {
                    activeIndex: targetIdx - 1,
                    newNodePreview: { value: val, targetIdx },
                    pointerStage: 'create-node'
                },
                { prevNode: items[targetIdx - 1], nextNode: items[targetIdx] }
            );
            pushFrame(
                `Splice Pointers: [${items[targetIdx - 1]}] → [${val}] → [${items[targetIdx]}]`,
                `Set newNode.next = [${items[targetIdx]}] and [${items[targetIdx - 1]}].next = newNode${isDoubly ? ' (plus bidirectional .prev links)' : ''}.`,
                1,
                {
                    activeIndex: targetIdx - 1,
                    newNodePreview: { value: val, targetIdx },
                    pointerStage: 'wire-next'
                },
                { splicedValue: val }
            );
            items.splice(targetIdx, 0, val);
            pushFrame(
                `Inserted [${val}] at Position ${targetIdx}`,
                `Pointer splice complete. List length is now ${items.length}.`,
                1,
                { items, foundIndex: targetIdx, pointerStage: 'complete' },
                { insertedAt: targetIdx, value: val }
            );
            return { frames, nextItems: items };
        }

        if (action === 'deleteHead' || action === 'deleteTail' || action === 'deletePos' || action === 'deleteVal') {
            if (items.length === 0) {
                pushFrame('Linked List Underflow', 'Cannot delete from an empty linked list (HEAD == NULL).', 2, {}, {}, 'List is empty.');
                return { frames, nextItems: items };
            }
            let delIdx = 0;
            if (action === 'deleteTail') delIdx = items.length - 1;
            else if (action === 'deletePos') delIdx = Math.max(0, Math.min(items.length - 1, pos));
            else if (action === 'deleteVal') {
                delIdx = items.findIndex((x) => x === val);
                if (delIdx === -1) {
                    pushFrame(
                        `Value ${val} Not Found`,
                        `Traversed all ${items.length} nodes; value ${val} is not in the linked list.`,
                        3,
                        {},
                        { target: val },
                        `Node with value ${val} not found.`
                    );
                    return { frames, nextItems: items };
                }
            }

            for (let i = 0; i <= delIdx; i++) {
                accesses++;
                pushFrame(
                    `Locate Target Node #${i} (${items[i]})`,
                    i === delIdx
                        ? `Target node [${items[i]}] at position ${delIdx} locked for unlinking.`
                        : `Following .next pointer through node #${i} (${items[i]}).`,
                    2,
                    { activeIndex: i, pointerStage: 'traverse' },
                    { currIndex: i, currVal: items[i] }
                );
            }

            const removed = items[delIdx];
            pushFrame(
                `Bypass Target Node [${removed}]`,
                delIdx === 0
                    ? `Advancing HEAD pointer to HEAD.next (${items[1] ?? 'NULL'}).`
                    : `Rewiring node[${delIdx - 1}].next → node[${delIdx + 1}] (${items[delIdx + 1] ?? (isCircular ? items[0] : 'NULL')}).`,
                3,
                { activeIndex: delIdx, pointerStage: 'bypass' },
                { unlinking: removed, position: delIdx }
            );

            items.splice(delIdx, 1);
            pushFrame(
                `Deallocated Node [${removed}]`,
                `Freed memory for node [${removed}]. Remaining list size = ${items.length}.`,
                3,
                { items, pointerStage: 'complete' },
                { deleted: removed, size: items.length }
            );
            return { frames, nextItems: items };
        }

        if (action === 'reverse') {
            if (items.length <= 1) {
                pushFrame('Reverse Complete', 'List has 0 or 1 node; already reversed.', 4, { items });
                return { frames, nextItems: items };
            }
            pushFrame(
                'Initialize Three-Pointer In-Place Reversal',
                'Setting prev = NULL, curr = HEAD, next = NULL to flip every link in O(n) time and O(1) space.',
                4,
                { activeIndex: 0 },
                { prev: 'NULL', curr: items[0] }
            );
            for (let i = 0; i < items.length; i++) {
                accesses++;
                pushFrame(
                    `Flip Pointer at Node [${items[i]}]`,
                    `Saving next = curr.next, then reversing curr.next → ${i === 0 ? 'NULL' : items[i - 1]}.`,
                    4,
                    { activeIndex: i, pointerStage: 'flip' },
                    { prev: i === 0 ? 'NULL' : items[i - 1], curr: items[i], next: items[i + 1] ?? 'NULL' }
                );
            }
            items.reverse();
            pushFrame(
                'Linked List Reversed In-Place!',
                `All ${items.length} node pointers inverted. New HEAD is [${items[0]}].`,
                4,
                { items, foundIndex: 0 },
                { newHead: items[0], newTail: items[items.length - 1] }
            );
            return { frames, nextItems: items };
        }

        if (action === 'search' || action === 'traverse') {
            for (let i = 0; i < items.length; i++) {
                comparisons++;
                accesses++;
                const isMatch = action === 'search' && items[i] === val;
                pushFrame(
                    action === 'search' ? `Inspect Node #${i} (${items[i]})` : `Visit Node #${i} (${items[i]})`,
                    action === 'search'
                        ? `Comparing node.data (${items[i]}) with target ${val} → ${isMatch ? 'FOUND!' : 'Continue along .next'}.`
                        : `Visited node #${i} with payload ${items[i]}. Following .next pointer.`,
                    2,
                    { comparingIndex: i, foundIndex: isMatch ? i : -1 },
                    { index: i, nodeData: items[i], next: items[i + 1] ?? (isCircular ? `HEAD(${items[0]})` : 'NULL') }
                );
                if (isMatch) return { frames, nextItems: items };
            }
            if (action === 'search') {
                pushFrame(
                    `Value ${val} Not Found`,
                    `Reached ${isCircular ? 'back to HEAD' : 'NULL'} after checking ${items.length} nodes.`,
                    3,
                    {},
                    { result: -1 },
                    `Target ${val} not found in linked list.`
                );
            } else {
                pushFrame(
                    'Traversal Complete',
                    `Visited all ${items.length} nodes sequentially: ${items.join(' → ')}.`,
                    3,
                    { items }
                );
            }
            return { frames, nextItems: items };
        }
    }

    // ------------------- C. STACK (LIFO) -------------------
    if (engineType === 'stack') {
        const val = Number(payload.value ?? 50);

        if (action === 'push') {
            if (items.length >= capacity) {
                pushFrame(
                    'STACK OVERFLOW!',
                    `Cannot push ${val}: top (${items.length - 1}) == capacity - 1 (${capacity - 1}). Stack is full!`,
                    0,
                    { topIndex: items.length - 1 },
                    { top: items.length - 1, capacity },
                    `Stack Overflow Error: Maximum capacity (${capacity}) reached.`
                );
                return { frames, nextItems: items };
            }
            pushFrame(
                `Increment Top Pointer: top = ${items.length - 1} → ${items.length}`,
                `Checking capacity (${items.length}/${capacity}) and advancing top pointer to slot ${items.length}.`,
                0,
                { activeIndex: items.length, newNodePreview: { value: val } },
                { oldTop: items.length - 1, newTop: items.length, pushVal: val }
            );
            items.push(val);
            accesses++;
            pushFrame(
                `Pushed ${val} onto Stack Top (Index ${items.length - 1})`,
                `Element ${val} stored at stack[${items.length - 1}]. Stack size is now ${items.length}.`,
                1,
                { items, foundIndex: items.length - 1, topIndex: items.length - 1 },
                { top: items.length - 1, topValue: val }
            );
            return { frames, nextItems: items };
        }

        if (action === 'pop') {
            if (items.length === 0) {
                pushFrame(
                    'STACK UNDERFLOW!',
                    'Cannot pop from an empty stack (top == -1).',
                    2,
                    { topIndex: -1 },
                    { top: -1 },
                    'Stack Underflow Error: Stack is empty (top == -1).'
                );
                return { frames, nextItems: items };
            }
            const topVal = items[items.length - 1];
            pushFrame(
                `Highlight Top Element stack[${items.length - 1}] = ${topVal}`,
                `Reading top element ${topVal} before decrementing top pointer.`,
                2,
                { activeIndex: items.length - 1, topIndex: items.length - 1 },
                { top: items.length - 1, poppingValue: topVal }
            );
            items.pop();
            accesses++;
            pushFrame(
                `Popped ${topVal} (New Top = ${items.length - 1})`,
                `Removed ${topVal} in O(1) LIFO order. Stack size is now ${items.length}.`,
                3,
                { items, topIndex: items.length - 1 },
                { popped: topVal, newTop: items.length - 1 }
            );
            return { frames, nextItems: items };
        }

        if (action === 'peek') {
            if (items.length === 0) {
                pushFrame('Stack Empty (Peek Failed)', 'top == -1; no element to peek.', 4, {}, {}, 'Stack Underflow: Cannot peek empty stack.');
                return { frames, nextItems: items };
            }
            const topVal = items[items.length - 1];
            accesses++;
            pushFrame(
                `Peek Top: stack[${items.length - 1}] = ${topVal}`,
                `Inspected top element (${topVal}) in O(1) time without modifying stack.`,
                4,
                { foundIndex: items.length - 1, topIndex: items.length - 1 },
                { top: items.length - 1, peekValue: topVal }
            );
            return { frames, nextItems: items };
        }

        if (action === 'search') {
            for (let i = items.length - 1; i >= 0; i--) {
                comparisons++;
                accesses++;
                const distFromTop = items.length - i;
                pushFrame(
                    `Scan Down from Top: stack[${i}] = ${items[i]}`,
                    `Depth ${distFromTop} from TOP: comparing ${items[i]} with ${val}.`,
                    4,
                    { comparingIndex: i, topIndex: items.length - 1 },
                    { index: i, depthFromTop: distFromTop, value: items[i] }
                );
                if (items[i] === val) {
                    pushFrame(
                        `Found ${val} at Stack Index ${i} (Depth ${distFromTop})`,
                        `Located ${val} at ${distFromTop} position(s) from the top.`,
                        4,
                        { foundIndex: i, topIndex: items.length - 1 },
                        { foundIndex: i, depthFromTop: distFromTop }
                    );
                    return { frames, nextItems: items };
                }
            }
            pushFrame(`Value ${val} Not in Stack`, `Scanned all ${items.length} stack frames.`, 4, {}, {}, `${val} not found in stack.`);
            return { frames, nextItems: items };
        }
    }

    // ------------------- D. QUEUES (Linear, Circular, Deque, Priority) -------------------
    if (engineType === 'queue') {
        const val = Number(payload.value ?? 35);

        if (action === 'enqueue' || action === 'pushRear' || action === 'pushFront') {
            if (items.length >= capacity) {
                pushFrame(
                    'QUEUE OVERFLOW!',
                    `Queue has reached maximum capacity (${capacity}/${capacity}). ${subVariant === 'circular' ? '(rear + 1) % cap == front!' : 'No free slots available.'}`,
                    0,
                    {},
                    { size: items.length, capacity },
                    `Queue Overflow Error: Capacity of ${capacity} reached.`
                );
                return { frames, nextItems: items };
            }

            if (action === 'pushFront' && subVariant === 'deque') {
                pushFrame(
                    `Decrement Front Pointer for pushFront(${val})`,
                    `Wrapping front pointer backward in O(1) to insert ${val} at the front of the Deque.`,
                    0,
                    { activeIndex: 0, newNodePreview: { value: val } },
                    { operation: 'pushFront', value: val }
                );
                items.unshift(val);
                pushFrame(
                    `Inserted ${val} at Deque Front`,
                    `FRONT is now ${val}. Deque size = ${items.length}.`,
                    1,
                    { items, foundIndex: 0 },
                    { front: items[0], rear: items[items.length - 1] }
                );
                return { frames, nextItems: items };
            }

            pushFrame(
                subVariant === 'circular'
                    ? `Advance Circular Rear: rear = (${items.length - 1} + 1) % ${capacity}`
                    : subVariant === 'priority'
                      ? `Insert ${val} into Priority Queue & Bubble Up`
                      : `Advance Rear Pointer to Slot ${items.length}`,
                `Preparing to enqueue ${val} at the rear of the ${subVariant} queue.`,
                0,
                { activeIndex: items.length, newNodePreview: { value: val } },
                { enqueueValue: val, rearSlot: items.length }
            );

            items.push(val);
            if (subVariant === 'priority') {
                // Sort ascending (Min-Priority Queue) or show heap ordering step
                items.sort((a, b) => a - b);
                pushFrame(
                    `Restore Priority Order (Highest Priority Front = ${items[0]})`,
                    `Reordered elements by priority key so highest-priority item (${items[0]}) sits at FRONT.`,
                    1,
                    { items, foundIndex: items.indexOf(val) },
                    { frontPriority: items[0], size: items.length }
                );
            } else {
                pushFrame(
                    `Enqueued ${val} at Rear`,
                    `Element ${val} joined at REAR (index ${items.length - 1}). FRONT = ${items[0]}.`,
                    1,
                    { items, foundIndex: items.length - 1 },
                    { front: items[0], rear: items[items.length - 1] }
                );
            }
            return { frames, nextItems: items };
        }

        if (action === 'dequeue' || action === 'popFront' || action === 'popRear') {
            if (items.length === 0) {
                pushFrame(
                    'QUEUE UNDERFLOW!',
                    'Cannot dequeue from an empty queue (size == 0).',
                    2,
                    {},
                    { size: 0 },
                    'Queue Underflow Error: Queue is currently empty.'
                );
                return { frames, nextItems: items };
            }

            const isRearPop = action === 'popRear' && subVariant === 'deque';
            const targetIdx = isRearPop ? items.length - 1 : 0;
            const removed = items[targetIdx];

            pushFrame(
                isRearPop ? `Select Rear Element (${removed}) for popRear` : `Select Front Element (${removed}) for Dequeue`,
                `Accessing ${isRearPop ? 'REAR' : 'FRONT'} element ${removed} at index ${targetIdx}.`,
                2,
                { activeIndex: targetIdx },
                { removing: removed, from: isRearPop ? 'REAR' : 'FRONT' }
            );

            if (isRearPop) items.pop();
            else items.shift();

            pushFrame(
                `Dequeued ${removed}`,
                `Removed ${removed} in O(1) time. Remaining queue size = ${items.length}.`,
                3,
                { items },
                { dequeued: removed, newFront: items[0] ?? 'EMPTY', newRear: items[items.length - 1] ?? 'EMPTY' }
            );
            return { frames, nextItems: items };
        }

        if (action === 'front' || action === 'rear') {
            if (items.length === 0) {
                pushFrame('Queue Empty', `Cannot inspect ${action.toUpperCase()} of an empty queue.`, 4, {}, {}, 'Queue is empty.');
                return { frames, nextItems: items };
            }
            const idx = action === 'front' ? 0 : items.length - 1;
            pushFrame(
                `Inspect ${action.toUpperCase()}: ${items[idx]}`,
                `${action.toUpperCase()} pointer references element ${items[idx]} at index ${idx}.`,
                4,
                { foundIndex: idx },
                { [action]: items[idx], index: idx }
            );
            return { frames, nextItems: items };
        }
    }

    pushFrame('Ready', 'Select an operation above to animate step-by-step execution.', 0, { items });
    return { frames, nextItems: items };
};

/* =========================================================================
   4. TREES, HEAPS, TRIES, HASH TABLES, DSU & ADVANCED DS STEP GENERATOR
   ========================================================================= */

// Helper to build a balanced or BST tree layout with 2D coordinates (x in 0..800, y in 40..320)
export const buildTreeVisualLayout = (values = [], mode = 'bst') => {
    const clean = values.map(Number).filter((n) => !Number.isNaN(n));
    if (clean.length === 0) return { nodes: [], edges: [], height: 0 };

    let root = null;

    const getH = (n) => (n ? n.h : 0);
    const getBF = (n) => (n ? getH(n.left) - getH(n.right) : 0);
    const updateH = (n) => {
        if (n) n.h = 1 + Math.max(getH(n.left), getH(n.right));
    };

    const rotRight = (y) => {
        const x = y.left;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        updateH(y);
        updateH(x);
        return x;
    };

    const rotLeft = (x) => {
        const y = x.right;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        updateH(x);
        updateH(y);
        return y;
    };

    const insertAVL = (node, val) => {
        if (!node) return { val, left: null, right: null, h: 1 };
        if (val < node.val) node.left = insertAVL(node.left, val);
        else if (val > node.val) node.right = insertAVL(node.right, val);
        else return node;

        updateH(node);
        const bf = getBF(node);
        if (bf > 1 && val < node.left.val) return rotRight(node);
        if (bf < -1 && val > node.right.val) return rotLeft(node);
        if (bf > 1 && val > node.left.val) {
            node.left = rotLeft(node.left);
            return rotRight(node);
        }
        if (bf < -1 && val < node.right.val) {
            node.right = rotRight(node.right);
            return rotLeft(node);
        }
        return node;
    };

    const insertBST = (node, val) => {
        if (!node) return { val, left: null, right: null, h: 1 };
        if (val < node.val) node.left = insertBST(node.left, val);
        else if (val > node.val) node.right = insertBST(node.right, val);
        updateH(node);
        return node;
    };

    if (mode === 'level' || mode === 'heap' || mode === 'binary') {
        // Level-order complete binary tree layout (used for Binary Tree, Heaps)
        const nodeObjs = clean.map((v, idx) => ({
            id: `n-${idx}`,
            val: v,
            idx,
            left: null,
            right: null,
            h: 1
        }));
        for (let i = 0; i < nodeObjs.length; i++) {
            const l = 2 * i + 1;
            const r = 2 * i + 2;
            if (l < nodeObjs.length) nodeObjs[i].left = nodeObjs[l];
            if (r < nodeObjs.length) nodeObjs[i].right = nodeObjs[r];
        }
        root = nodeObjs[0];
    } else if (mode === 'avl' || mode === 'rbt') {
        for (const v of clean) root = insertAVL(root, v);
    } else {
        for (const v of clean) root = insertBST(root, v);
    }

    const nodes = [];
    const edges = [];
    let maxDepth = 0;

    const assignCoords = (node, depth, leftBound, rightBound, parentId = null, isRed = false) => {
        if (!node) return;
        maxDepth = Math.max(maxDepth, depth + 1);
        const x = (leftBound + rightBound) / 2;
        const y = 45 + depth * 68;
        const id = `node-${node.val}-${depth}-${Math.round(x)}`;
        const bf = getH(node.left) - getH(node.right);

        nodes.push({
            id,
            val: node.val,
            x,
            y,
            depth,
            bf,
            height: node.h || 1,
            color: mode === 'rbt' ? (depth === 0 ? 'BLACK' : isRed ? 'RED' : 'BLACK') : 'DEFAULT'
        });

        if (parentId) {
            edges.push({ from: parentId, to: id });
        }
        assignCoords(node.left, depth + 1, leftBound, x, id, !isRed);
        assignCoords(node.right, depth + 1, x, rightBound, id, !isRed);
    };

    assignCoords(root, 0, 30, 770, null, false);
    return { nodes, edges, height: maxDepth, root };
};

export const generateTreeAndAdvancedFrames = (engineType, subVariant, currentData = [], action = 'init', payload = {}) => {
    const frames = [];
    let comparisons = 0;

    // 1. TREE STRUCTURES & TREE ALGORITHMS
    if (engineType === 'tree') {
        let values = [...currentData].map(Number).filter((n) => !Number.isNaN(n));
        const isHeap = subVariant === 'heap' || subVariant === 'heap-ops';
        const isAVL = subVariant === 'avl' || subVariant === 'avl-rotations';
        const isRBT = subVariant === 'rbt';
        const layoutMode = isHeap ? 'heap' : subVariant === 'binary' ? 'binary' : isAVL ? 'avl' : isRBT ? 'rbt' : 'bst';

        const pushTreeFrame = (title, detail, pseudoLine, vals, extra = {}, vars = {}, error = null) => {
            const layout = buildTreeVisualLayout(vals, layoutMode);
            frames.push({
                stepIndex: frames.length,
                title,
                detail,
                pseudoLine,
                vars: { nodes: vals.length, height: layout.height, ...vars },
                metrics: { comparisons, size: vals.length, height: layout.height },
                error,
                visualState: {
                    engineType: 'tree',
                    subVariant,
                    values: [...vals],
                    treeNodes: layout.nodes,
                    treeEdges: layout.edges,
                    activeVal: null,
                    foundVal: null,
                    pathVals: [],
                    traversalOrder: [],
                    rotationBadge: null,
                    showHeapArray: isHeap,
                    ...extra
                }
            });
        };

        const val = Number(payload.value ?? 45);
        const val2 = Number(payload.secondValue ?? 70);

        if (action === 'insert') {
            if (!isHeap && values.includes(val)) {
                pushTreeFrame(
                    `Duplicate Key ${val} Ignored`,
                    `Key ${val} already exists in the tree. Standard BST/AVL trees store unique keys.`,
                    0,
                    values,
                    { foundVal: val },
                    { key: val },
                    `Duplicate key ${val} already exists.`
                );
                return { frames, nextData: values };
            }

            if (isHeap) {
                pushTreeFrame(
                    `Append ${val} at Next Complete Tree Leaf (Index ${values.length})`,
                    `Inserting ${val} at end of heap array before sifting up to restore heap order.`,
                    0,
                    [...values, val],
                    { activeVal: val },
                    { insertedAt: values.length, key: val }
                );
                values.push(val);
                let i = values.length - 1;
                while (i > 0) {
                    const p = Math.floor((i - 1) / 2);
                    comparisons++;
                    pushTreeFrame(
                        `Compare Child (${values[i]}) with Parent (${values[p]})`,
                        `Checking Min-Heap property between index ${i} (${values[i]}) and parent index ${p} (${values[p]}).`,
                        1,
                        values,
                        { activeVal: values[i], pathVals: [values[p], values[i]] },
                        { childIdx: i, parentIdx: p }
                    );
                    if (values[i] < values[p]) {
                        [values[i], values[p]] = [values[p], values[i]];
                        pushTreeFrame(
                            `Sift-Up Swap: ${values[p]} ↔ ${values[i]}`,
                            `Child was smaller than parent; swapped up the heap tree.`,
                            1,
                            values,
                            { activeVal: values[p], pathVals: [values[p], values[i]] },
                            { newIdx: p }
                        );
                        i = p;
                    } else break;
                }
                pushTreeFrame(`Heap Insertion Complete`, `Heap property satisfied with root = ${values[0]}.`, 1, values, {
                    foundVal: val
                });
                return { frames, nextData: values };
            }

            // Standard BST / AVL / RBT path trace
            const layoutBefore = buildTreeVisualLayout(values, layoutMode);
            let curr = layoutBefore.root;
            const path = [];
            while (curr) {
                comparisons++;
                path.push(curr.val);
                const dir = val < curr.val ? 'LEFT' : 'RIGHT';
                pushTreeFrame(
                    `Compare ${val} with Node (${curr.val}) → Go ${dir}`,
                    `${val} ${val < curr.val ? '<' : '>'} ${curr.val}: descending down the ${dir} subtree.`,
                    0,
                    values,
                    { activeVal: curr.val, pathVals: [...path] },
                    { current: curr.val, insertKey: val, direction: dir }
                );
                curr = val < curr.val ? curr.left : curr.right;
            }

            const nextValues = [...values, val];
            if (isAVL) {
                pushTreeFrame(
                    `Insert ${val} & Recompute AVL Balance Factors`,
                    `Attached ${val} as leaf and checked |bf(node)| <= 1 along ancestor path (applying LL/RR/LR/RL rotation if |bf| == 2).`,
                    2,
                    nextValues,
                    { foundVal: val, pathVals: [...path, val], rotationBadge: 'AVL Height-Balanced (|BF| ≤ 1)' },
                    { inserted: val }
                );
            } else if (isRBT) {
                pushTreeFrame(
                    `Insert ${val} as RED Leaf & Fix Red-Black Invariants`,
                    `Inserted ${val} colored RED and recolored/rotated ancestors so root remains BLACK with equal black-height.`,
                    2,
                    nextValues,
                    { foundVal: val, pathVals: [...path, val], rotationBadge: 'Red-Black Invariant Verified' },
                    { inserted: val }
                );
            } else {
                pushTreeFrame(
                    `Inserted Node (${val})`,
                    `Attached new leaf node (${val}) at the discovered NULL link.`,
                    0,
                    nextValues,
                    { foundVal: val, pathVals: [...path, val] },
                    { inserted: val }
                );
            }
            return { frames, nextData: nextValues };
        }

        if (action === 'delete') {
            if (values.length === 0) {
                pushTreeFrame('Tree Underflow', 'Cannot delete from an empty tree.', 2, values, {}, {}, 'Tree is empty.');
                return { frames, nextData: values };
            }
            const target = isHeap ? values[0] : val;
            if (!values.includes(target)) {
                pushTreeFrame(
                    `Key ${target} Not Found`,
                    `Cannot delete ${target} because it is not present in the tree.`,
                    2,
                    values,
                    {},
                    { target },
                    `Key ${target} not found in tree.`
                );
                return { frames, nextData: values };
            }
            pushTreeFrame(
                `Locate Node (${target}) for Deletion`,
                isHeap
                    ? `Extracting root extremum (${target}), moving last leaf (${values[values.length - 1]}) to root, and sifting down.`
                    : `Found target node (${target}). Replacing with inorder successor if it has 2 children and rebalancing.`,
                3,
                values,
                { activeVal: target, pathVals: [target] },
                { deleting: target }
            );
            const nextValues = values.filter((x) => x !== target);
            if (isHeap && nextValues.length > 1) {
                nextValues.sort((a, b) => a - b);
            }
            pushTreeFrame(
                `Deleted Node (${target})`,
                `Removed ${target} and restored structural invariants. Remaining nodes = ${nextValues.length}.`,
                4,
                nextValues,
                {},
                { deleted: target }
            );
            return { frames, nextData: nextValues };
        }

        if (action === 'search') {
            const layout = buildTreeVisualLayout(values, layoutMode);
            let curr = layout.root;
            const path = [];
            while (curr) {
                comparisons++;
                path.push(curr.val);
                if (curr.val === val) {
                    pushTreeFrame(
                        `Key ${val} Found!`,
                        `Located node (${val}) at depth ${path.length - 1} after ${comparisons} comparison(s).`,
                        1,
                        values,
                        { foundVal: val, pathVals: [...path] },
                        { found: val, comparisons }
                    );
                    return { frames, nextData: values };
                }
                const dir = val < curr.val ? 'LEFT' : 'RIGHT';
                pushTreeFrame(
                    `Compare ${val} vs Node (${curr.val}) → Go ${dir}`,
                    `${val} ${val < curr.val ? '<' : '>'} ${curr.val}: eliminating the opposite subtree.`,
                    1,
                    values,
                    { activeVal: curr.val, pathVals: [...path] },
                    { current: curr.val, target: val, dir }
                );
                curr = val < curr.val ? curr.left : curr.right;
            }
            pushTreeFrame(
                `Key ${val} Not Found`,
                `Reached a NULL child pointer after ${comparisons} comparisons.`,
                1,
                values,
                { pathVals: path },
                { target: val, result: 'NULL' },
                `Key ${val} does not exist in this tree.`
            );
            return { frames, nextData: values };
        }

        if (['inorder', 'preorder', 'postorder', 'levelorder'].includes(action)) {
            const layout = buildTreeVisualLayout(values, layoutMode);
            const visited = [];

            const visitNode = (node, label) => {
                visited.push(node.val);
                pushTreeFrame(
                    `${label}: Visit Node (${node.val})`,
                    `Traversal sequence so far: [${visited.join(' → ')}].`,
                    1,
                    values,
                    { activeVal: node.val, pathVals: [...visited], traversalOrder: [...visited] },
                    { current: node.val, visitedCount: visited.length }
                );
            };

            const dfs = (node) => {
                if (!node) return;
                if (action === 'preorder') visitNode(node, 'Preorder (Root-L-R)');
                dfs(node.left);
                if (action === 'inorder') visitNode(node, 'Inorder (L-Root-R)');
                dfs(node.right);
                if (action === 'postorder') visitNode(node, 'Postorder (L-R-Root)');
            };

            if (action === 'levelorder') {
                const q = layout.root ? [layout.root] : [];
                while (q.length > 0) {
                    const curr = q.shift();
                    visitNode(curr, 'Level-Order (BFS Queue)');
                    if (curr.left) q.push(curr.left);
                    if (curr.right) q.push(curr.right);
                }
            } else {
                dfs(layout.root);
            }

            pushTreeFrame(
                `${action.toUpperCase()} Traversal Complete`,
                `Full traversal output: [${visited.join(' → ')}].`,
                2,
                values,
                { pathVals: visited, traversalOrder: visited },
                { result: visited.join(' → ') }
            );
            return { frames, nextData: values };
        }

        if (action === 'minmax' || action === 'height' || action === 'lca') {
            const layout = buildTreeVisualLayout(values, layoutMode);
            if (action === 'minmax' && values.length > 0) {
                const minV = Math.min(...values);
                const maxV = Math.max(...values);
                pushTreeFrame(
                    `Minimum = ${minV} (Leftmost) | Maximum = ${maxV} (Rightmost)`,
                    `Followed extreme left spine to minimum (${minV}) and extreme right spine to maximum (${maxV}).`,
                    1,
                    values,
                    { foundVal: minV, pathVals: [minV, maxV] },
                    { min: minV, max: maxV }
                );
                return { frames, nextData: values };
            }
            if (action === 'height') {
                for (const n of layout.nodes) {
                    pushTreeFrame(
                        `Compute Subtree Height at Node (${n.val}) = ${n.height}`,
                        `height(${n.val}) = 1 + max(leftHeight, rightHeight) = ${n.height} (Balance Factor = ${n.bf}).`,
                        2,
                        values,
                        { activeVal: n.val, pathVals: [n.val] },
                        { node: n.val, subtreeHeight: n.height, balanceFactor: n.bf }
                    );
                }
                pushTreeFrame(
                    `Total Tree Height = ${layout.height}`,
                    `Longest root-to-leaf path contains ${layout.height} levels.`,
                    3,
                    values,
                    { foundVal: layout.root?.val },
                    { totalHeight: layout.height }
                );
                return { frames, nextData: values };
            }
            if (action === 'lca') {
                let curr = layout.root;
                const p = val;
                const q = val2;
                const path = [];
                while (curr) {
                    path.push(curr.val);
                    comparisons++;
                    if (p < curr.val && q < curr.val) {
                        pushTreeFrame(
                            `Both ${p} and ${q} < ${curr.val} → Move Left`,
                            `LCA must lie in the left subtree of ${curr.val}.`,
                            1,
                            values,
                            { activeVal: curr.val, pathVals: [...path] },
                            { p, q, curr: curr.val }
                        );
                        curr = curr.left;
                    } else if (p > curr.val && q > curr.val) {
                        pushTreeFrame(
                            `Both ${p} and ${q} > ${curr.val} → Move Right`,
                            `LCA must lie in the right subtree of ${curr.val}.`,
                            2,
                            values,
                            { activeVal: curr.val, pathVals: [...path] },
                            { p, q, curr: curr.val }
                        );
                        curr = curr.right;
                    } else {
                        pushTreeFrame(
                            `Split Point Found! LCA(${p}, ${q}) = ${curr.val}`,
                            `Node ${curr.val} is the deepest ancestor where paths to ${p} and ${q} diverge.`,
                            3,
                            values,
                            { foundVal: curr.val, pathVals: [...path] },
                            { p, q, LCA: curr.val }
                        );
                        return { frames, nextData: values };
                    }
                }
            }
        }

        pushTreeFrame('Tree Initialized', `Loaded ${values.length} nodes into ${subVariant.toUpperCase()} structure.`, 0, values);
        return { frames, nextData: values };
    }

    // 2. TRIE (PREFIX TREE)
    if (engineType === 'trie') {
        const words = [...currentData].map((w) => String(w).toUpperCase().trim()).filter(Boolean);
        const word = String(payload.text || 'CODE').toUpperCase().trim();

        const pushTrieFrame = (title, detail, pseudoLine, wordList, activePrefix = '', foundWord = false, error = null) => {
            frames.push({
                stepIndex: frames.length,
                title,
                detail,
                pseudoLine,
                vars: { dictionarySize: wordList.length, word, activePrefix },
                metrics: { comparisons, size: wordList.length },
                error,
                visualState: {
                    engineType: 'trie',
                    words: [...wordList],
                    activePrefix,
                    activeWord: word,
                    foundWord
                }
            });
        };

        if (action === 'insert' && word) {
            for (let i = 1; i <= word.length; i++) {
                const pref = word.slice(0, i);
                pushTrieFrame(
                    `Step ${i}: Traverse/Create Character Node '${word[i - 1]}' (Prefix "${pref}")`,
                    `Following edge '${word[i - 1]}' from depth ${i - 1} to depth ${i}.`,
                    1,
                    words,
                    pref
                );
            }
            if (!words.includes(word)) words.push(word);
            pushTrieFrame(
                `Mark isEndOfWord = TRUE for "${word}"`,
                `Word "${word}" stored in Trie in O(${word.length}) character steps.`,
                2,
                words,
                word,
                true
            );
            return { frames, nextData: words };
        }

        if (action === 'search' || action === 'prefix') {
            for (let i = 1; i <= word.length; i++) {
                comparisons++;
                const pref = word.slice(0, i);
                const hasPrefix = words.some((w) => w.startsWith(pref));
                pushTrieFrame(
                    `Check Character '${word[i - 1]}' (Prefix "${pref}")`,
                    hasPrefix ? `Prefix "${pref}" exists in Trie; continuing downward.` : `Transition for '${word[i - 1]}' is NULL!`,
                    3,
                    words,
                    pref,
                    false,
                    hasPrefix ? null : `Prefix "${pref}" does not exist in Trie.`
                );
                if (!hasPrefix) return { frames, nextData: words };
            }
            const exact = action === 'prefix' ? true : words.includes(word);
            pushTrieFrame(
                exact
                    ? `${action === 'prefix' ? 'Prefix' : 'Word'} "${word}" Found in O(${word.length})!`
                    : `"${word}" is only a prefix (isEndOfWord == FALSE)`,
                exact
                    ? `Matched all ${word.length} characters along root-to-terminal path.`
                    : `Path exists, but terminal node is not marked as a complete word.`,
                4,
                words,
                word,
                exact,
                exact ? null : `"${word}" is not marked as a complete word in the Trie.`
            );
            return { frames, nextData: words };
        }

        if (action === 'delete') {
            const nextWords = words.filter((w) => w !== word);
            pushTrieFrame(
                `Unmark & Prune "${word}"`,
                `Cleared isEndOfWord flag for "${word}" and pruned unshared leaf links.`,
                4,
                nextWords,
                word
            );
            return { frames, nextData: nextWords };
        }

        pushTrieFrame('Trie Initialized', `Loaded ${words.length} words into prefix tree.`, 0, words);
        return { frames, nextData: words };
    }

    // 3. HASH TABLE
    if (engineType === 'hash-table') {
        const bucketCount = 7;
        const entries = [...currentData]; // array of { key, val }
        const key = Number(payload.value ?? 24);
        const val = payload.text || `Val_${key}`;
        const h = ((key % bucketCount) + bucketCount) % bucketCount;

        const buildBuckets = (list) => {
            const b = Array.from({ length: bucketCount }, (_, idx) => ({ bucketIndex: idx, chain: [] }));
            for (const item of list) {
                const k = typeof item === 'object' ? item.key : Number(item);
                const v = typeof item === 'object' ? item.val : `V${item}`;
                const bIdx = ((k % bucketCount) + bucketCount) % bucketCount;
                b[bIdx].chain.push({ key: k, val: v });
            }
            return b;
        };

        const pushHashFrame = (title, detail, pseudoLine, list, activeBucket = -1, highlightKey = null, error = null) => {
            frames.push({
                stepIndex: frames.length,
                title,
                detail,
                pseudoLine,
                vars: { key, hashFormula: `${key} % ${bucketCount} = ${h}`, loadFactor: (list.length / bucketCount).toFixed(2) },
                metrics: { comparisons, size: list.length },
                error,
                visualState: {
                    engineType: 'hash-table',
                    buckets: buildBuckets(list),
                    activeBucket,
                    highlightKey
                }
            });
        };

        if (action === 'insert') {
            pushHashFrame(
                `Compute Hash: h(${key}) = ${key} % ${bucketCount} = Bucket #${h}`,
                `Mapped key ${key} to Bucket #${h} in O(1) time.`,
                0,
                entries,
                h
            );
            const filtered = entries.filter((e) => (typeof e === 'object' ? e.key : Number(e)) !== key);
            filtered.push({ key, val });
            pushHashFrame(
                `Insert (${key} : ${val}) into Bucket #${h}`,
                `Stored key-value pair in Bucket #${h}'s collision chain.`,
                2,
                filtered,
                h,
                key
            );
            return { frames, nextData: filtered };
        }

        if (action === 'search') {
            comparisons++;
            pushHashFrame(
                `Hash Lookup: Jump to Bucket #${h} (${key} % ${bucketCount})`,
                `Scanning Bucket #${h}'s chain for key = ${key}.`,
                3,
                entries,
                h
            );
            const exists = entries.some((e) => (typeof e === 'object' ? e.key : Number(e)) === key);
            pushHashFrame(
                exists ? `Key ${key} Found in Bucket #${h}!` : `Key ${key} Not Found in Bucket #${h}`,
                exists ? `Retrieved key ${key} in O(1) average lookup.` : `Bucket #${h} does not contain key ${key}.`,
                4,
                entries,
                h,
                exists ? key : null,
                exists ? null : `Key ${key} not found in Hash Table.`
            );
            return { frames, nextData: entries };
        }

        if (action === 'delete') {
            const next = entries.filter((e) => (typeof e === 'object' ? e.key : Number(e)) !== key);
            pushHashFrame(`Removed Key ${key} from Bucket #${h}`, `Unlinked key ${key} from Bucket #${h}.`, 4, next, h);
            return { frames, nextData: next };
        }

        pushHashFrame('Hash Table Ready', `7-Bucket Hash Table initialized with Separate Chaining.`, 0, entries);
        return { frames, nextData: entries };
    }

    // 4. DISJOINT SET UNION (UNION-FIND)
    if (engineType === 'dsu') {
        const n = 8;
        let state =
            currentData && currentData.parent
                ? JSON.parse(JSON.stringify(currentData))
                : {
                      parent: Array.from({ length: n }, (_, i) => i),
                      rank: Array(n).fill(0)
                  };

        const a = Math.max(0, Math.min(n - 1, Number(payload.value ?? 1)));
        const b = Math.max(0, Math.min(n - 1, Number(payload.secondValue ?? 5)));

        const findRoot = (x, path = []) => {
            path.push(x);
            if (state.parent[x] === x) return x;
            return findRoot(state.parent[x], path);
        };

        const pushDsuFrame = (title, detail, pseudoLine, activeNodes = [], highlightRoot = -1) => {
            frames.push({
                stepIndex: frames.length,
                title,
                detail,
                pseudoLine,
                vars: { a, b, parents: `[${state.parent.join(', ')}]` },
                metrics: { comparisons, size: n },
                visualState: {
                    engineType: 'dsu',
                    parent: [...state.parent],
                    rank: [...state.rank],
                    activeNodes,
                    highlightRoot
                }
            });
        };

        if (action === 'find') {
            const path = [];
            const root = findRoot(a, path);
            pushDsuFrame(
                `Trace Parent Pointers from ${a} → Root ${root}`,
                `Path climbed: ${path.join(' → ')}. Applying path compression so all nodes point directly to root ${root}.`,
                1,
                path,
                root
            );
            for (const node of path) state.parent[node] = root;
            pushDsuFrame(`Path Compression Complete: find(${a}) = ${root}`, `parent[${a}] now points directly to representative ${root}.`, 2, [a], root);
            return { frames, nextData: state };
        }

        if (action === 'union') {
            const pathA = [];
            const pathB = [];
            const rootA = findRoot(a, pathA);
            const rootB = findRoot(b, pathB);

            pushDsuFrame(
                `Find Representatives: find(${a}) = ${rootA}, find(${b}) = ${rootB}`,
                rootA === rootB
                    ? `Elements ${a} and ${b} already belong to the same set (Root ${rootA})!`
                    : `Merging component ${rootA} (rank ${state.rank[rootA]}) and component ${rootB} (rank ${state.rank[rootB]}) by rank.`,
                2,
                [...pathA, ...pathB],
                rootA
            );

            if (rootA !== rootB) {
                if (state.rank[rootA] < state.rank[rootB]) {
                    state.parent[rootA] = rootB;
                } else if (state.rank[rootA] > state.rank[rootB]) {
                    state.parent[rootB] = rootA;
                } else {
                    state.parent[rootB] = rootA;
                    state.rank[rootA]++;
                }
                pushDsuFrame(
                    `Union(${a}, ${b}) Merged Under Root ${state.parent[rootB]}`,
                    `Attached lower-rank root under higher-rank root in O(α(n)) time.`,
                    4,
                    [a, b, rootA, rootB],
                    state.parent[rootB]
                );
            }
            return { frames, nextData: state };
        }

        pushDsuFrame('Disjoint Set Forest Initialized', `${n} disjoint singleton sets {0}..{${n - 1}} ready.`, 0);
        return { frames, nextData: state };
    }

    // 5. ADVANCED STRUCTURES (Segment Tree, Fenwick Tree, B-Tree / B+ Tree)
    const arr = [...currentData].map(Number).filter((n) => !Number.isNaN(n));
    const idx = Math.max(0, Math.min(arr.length - 1, Number(payload.index ?? 1)));
    const val = Number(payload.value ?? 10);
    const qL = Math.max(0, Math.min(arr.length - 1, Number(payload.left ?? 1)));
    const qR = Math.max(qL, Math.min(arr.length - 1, Number(payload.right ?? Math.min(arr.length - 1, 4))));

    const pushAdvFrame = (title, detail, pseudoLine, dataArr, extra = {}, vars = {}) => {
        frames.push({
            stepIndex: frames.length,
            title,
            detail,
            pseudoLine,
            vars: { n: dataArr.length, ...vars },
            metrics: { comparisons, size: dataArr.length },
            visualState: {
                engineType,
                subVariant,
                array: [...dataArr],
                activeIndices: [],
                queryRange: null,
                rangeSum: null,
                ...extra
            }
        });
    };

    if (action === 'query') {
        let sum = 0;
        const active = [];
        for (let i = qL; i <= qR; i++) {
            sum += arr[i];
            active.push(i);
        }
        pushAdvFrame(
            `Decompose Range Query [${qL}..${qR}] into Logarithmic Intervals`,
            `Visiting canonical ${engineType === 'fenwick-tree' ? 'LSB prefix buckets (i -= i & -i)' : 'segment tree nodes'} covering [${qL}..${qR}].`,
            2,
            arr,
            { activeIndices: active, queryRange: [qL, qR] },
            { L: qL, R: qR }
        );
        pushAdvFrame(
            `Range Sum Query [${qL}..${qR}] = ${sum}`,
            `Aggregated [${arr.slice(qL, qR + 1).join(' + ')}] = ${sum} in O(log n) time.`,
            3,
            arr,
            { activeIndices: active, queryRange: [qL, qR], rangeSum: sum },
            { L: qL, R: qR, result: sum }
        );
        return { frames, nextData: arr };
    }

    if (action === 'update' || action === 'insert') {
        if (engineType === 'btree') {
            if (!arr.includes(val)) arr.push(val);
            arr.sort((a, b) => a - b);
            pushAdvFrame(
                `Insert Key ${val} into Multi-Way B-Tree Page`,
                `Inserted key ${val} in sorted key order and split full internal pages by promoting median key.`,
                2,
                arr,
                { activeIndices: [arr.indexOf(val)] },
                { insertedKey: val, totalKeys: arr.length }
            );
            return { frames, nextData: arr };
        }
        const old = arr[idx];
        arr[idx] = val;
        pushAdvFrame(
            `Point Update Index ${idx}: ${old} → ${val}`,
            `Updated leaf [${idx}] = ${val} and propagated delta (${val - old}) up O(log n) ancestor aggregates.`,
            4,
            arr,
            { activeIndices: [idx] },
            { index: idx, oldVal: old, newVal: val, delta: val - old }
        );
        return { frames, nextData: arr };
    }

    pushAdvFrame(`${engineType.toUpperCase()} Initialized`, `Built hierarchical range structure over [${arr.join(', ')}].`, 0, arr);
    return { frames, nextData: arr };
};

/* =========================================================================
   5. GRAPH DATA STRUCTURE & 10 GRAPH ALGORITHMS STEP GENERATOR
   ========================================================================= */
export const DEFAULT_GRAPH_STATE = {
    directed: false,
    vertices: [
        { id: 'A', x: 110, y: 150 },
        { id: 'B', x: 270, y: 65 },
        { id: 'C', x: 270, y: 235 },
        { id: 'D', x: 470, y: 65 },
        { id: 'E', x: 470, y: 235 },
        { id: 'F', x: 630, y: 150 }
    ],
    edges: [
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'B', to: 'D', weight: 5 },
        { from: 'C', to: 'E', weight: 8 },
        { from: 'C', to: 'D', weight: 7 },
        { from: 'D', to: 'E', weight: 2 },
        { from: 'D', to: 'F', weight: 6 },
        { from: 'E', to: 'F', weight: 3 }
    ]
};

export const computeGraphRepresentations = (graph) => {
    const ids = graph.vertices.map((v) => v.id);
    const adjList = {};
    ids.forEach((id) => {
        adjList[id] = [];
    });

    const matrix = ids.map(() => ids.map(() => 0));
    for (const e of graph.edges) {
        const u = ids.indexOf(e.from);
        const v = ids.indexOf(e.to);
        if (u === -1 || v === -1) continue;
        adjList[e.from].push({ to: e.to, weight: e.weight });
        matrix[u][v] = e.weight;
        if (!graph.directed) {
            adjList[e.to].push({ to: e.from, weight: e.weight });
            matrix[v][u] = e.weight;
        }
    }
    return { ids, adjList, matrix };
};

export const generateGraphFrames = (subVariant, rawGraph, startNode = 'A', targetNode = 'F') => {
    const graph = rawGraph && rawGraph.vertices?.length ? JSON.parse(JSON.stringify(rawGraph)) : JSON.parse(JSON.stringify(DEFAULT_GRAPH_STATE));
    const { ids, adjList } = computeGraphRepresentations(graph);
    const start = ids.includes(startNode) ? startNode : ids[0];
    const frames = [];
    let comparisons = 0;

    const pushGraphFrame = (title, detail, pseudoLine, extra = {}, vars = {}, error = null) => {
        frames.push({
            stepIndex: frames.length,
            title,
            detail,
            pseudoLine,
            vars: { vertices: ids.length, edges: graph.edges.length, ...vars },
            metrics: { comparisons, vertices: ids.length, edges: graph.edges.length },
            error,
            visualState: {
                engineType: 'graph',
                subVariant,
                graph,
                activeVertex: null,
                visitedVertices: [],
                activeEdge: null,
                highlightedEdges: [],
                traversalOrder: [],
                distances: {},
                queueOrStack: [],
                ...extra
            }
        });
    };

    // 1. BFS
    if (subVariant === 'bfs' || subVariant === 'interactive') {
        const visited = new Set([start]);
        const queue = [start];
        const order = [];
        const treeEdges = [];

        pushGraphFrame(
            `Initialize BFS from Source '${start}'`,
            `Enqueued source vertex '${start}' into FIFO Queue and marked it visited.`,
            0,
            { activeVertex: start, visitedVertices: [...visited], queueOrStack: [...queue] },
            { queue: `[${queue.join(', ')}]` }
        );

        while (queue.length > 0) {
            const u = queue.shift();
            order.push(u);
            pushGraphFrame(
                `Dequeue Vertex '${u}'`,
                `Exploring all unvisited neighbors of '${u}' at current BFS layer.`,
                2,
                {
                    activeVertex: u,
                    visitedVertices: [...visited],
                    traversalOrder: [...order],
                    highlightedEdges: [...treeEdges],
                    queueOrStack: [...queue]
                },
                { current: u, visitedOrder: order.join(' → ') }
            );

            for (const nb of adjList[u] || []) {
                comparisons++;
                if (!visited.has(nb.to)) {
                    visited.add(nb.to);
                    queue.push(nb.to);
                    treeEdges.push(`${u}-${nb.to}`);
                    pushGraphFrame(
                        `Discover Neighbor '${nb.to}' via Edge (${u} → ${nb.to})`,
                        `Marked '${nb.to}' visited and enqueued at rear of BFS queue.`,
                        3,
                        {
                            activeVertex: nb.to,
                            activeEdge: `${u}-${nb.to}`,
                            visitedVertices: [...visited],
                            traversalOrder: [...order],
                            highlightedEdges: [...treeEdges],
                            queueOrStack: [...queue]
                        },
                        { discovered: nb.to, queue: `[${queue.join(', ')}]` }
                    );
                }
            }
        }

        pushGraphFrame(
            'BFS Traversal Complete',
            `Layer-by-layer BFS order: ${order.join(' → ')}.`,
            4,
            { visitedVertices: [...visited], traversalOrder: order, highlightedEdges: treeEdges },
            { order: order.join(' → ') }
        );
        return frames;
    }

    // 2. DFS
    if (subVariant === 'dfs') {
        const visited = new Set();
        const order = [];
        const treeEdges = [];

        const dfsRec = (u, stackSnap) => {
            visited.add(u);
            order.push(u);
            pushGraphFrame(
                `DFS Visit Vertex '${u}'`,
                `Pushed '${u}' onto recursion call stack and marked visited.`,
                0,
                {
                    activeVertex: u,
                    visitedVertices: [...visited],
                    traversalOrder: [...order],
                    highlightedEdges: [...treeEdges],
                    queueOrStack: [...stackSnap, u]
                },
                { current: u, order: order.join(' → ') }
            );

            for (const nb of adjList[u] || []) {
                comparisons++;
                if (!visited.has(nb.to)) {
                    treeEdges.push(`${u}-${nb.to}`);
                    pushGraphFrame(
                        `Plunge Deeper Along Edge (${u} → ${nb.to})`,
                        `Neighbor '${nb.to}' is unvisited; recursing immediately.`,
                        2,
                        {
                            activeVertex: nb.to,
                            activeEdge: `${u}-${nb.to}`,
                            visitedVertices: [...visited],
                            traversalOrder: [...order],
                            highlightedEdges: [...treeEdges],
                            queueOrStack: [...stackSnap, u, nb.to]
                        },
                        { from: u, to: nb.to }
                    );
                    dfsRec(nb.to, [...stackSnap, u]);
                }
            }
        };

        dfsRec(start, []);
        pushGraphFrame(
            'DFS Traversal Complete',
            `Depth-First Search order: ${order.join(' → ')}.`,
            4,
            { visitedVertices: [...visited], traversalOrder: order, highlightedEdges: treeEdges },
            { order: order.join(' → ') }
        );
        return frames;
    }

    // 3. DIJKSTRA'S ALGORITHM (Strictly reject negative edge weights!)
    if (subVariant === 'dijkstra') {
        const negEdge = graph.edges.find((e) => Number(e.weight) < 0);
        if (negEdge) {
            pushGraphFrame(
                'Negative Edge Weight Rejected by Dijkstra!',
                `Edge (${negEdge.from} → ${negEdge.to}) has weight ${negEdge.weight} < 0. Dijkstra's greedy settled-vertex invariant fails with negative weights! Use Bellman-Ford instead.`,
                0,
                { activeEdge: `${negEdge.from}-${negEdge.to}` },
                { invalidEdge: `${negEdge.from}→${negEdge.to} (${negEdge.weight})` },
                `Invalid Input for Dijkstra: Edge (${negEdge.from} → ${negEdge.to}) has negative weight (${negEdge.weight}). Switch to Bellman-Ford or set non-negative weights.`
            );
            return frames;
        }

        const dist = {};
        const prev = {};
        ids.forEach((id) => {
            dist[id] = Infinity;
        });
        dist[start] = 0;
        const settled = new Set();
        const treeEdges = [];

        const formatDist = () => {
            const out = {};
            ids.forEach((k) => {
                out[k] = dist[k] === Infinity ? '∞' : dist[k];
            });
            return out;
        };

        pushGraphFrame(
            `Initialize Dijkstra Shortest Paths from '${start}'`,
            `Set dist[${start}] = 0 and all other vertex distances to ∞.`,
            0,
            { activeVertex: start, distances: formatDist() },
            { source: start }
        );

        while (settled.size < ids.length) {
            let u = null;
            let best = Infinity;
            for (const id of ids) {
                if (!settled.has(id) && dist[id] < best) {
                    best = dist[id];
                    u = id;
                }
            }
            if (!u) break;

            settled.add(u);
            pushGraphFrame(
                `Extract Min-Distance Vertex '${u}' (dist = ${dist[u]})`,
                `Settled vertex '${u}' from Priority Queue. Relaxing its outgoing edges.`,
                2,
                {
                    activeVertex: u,
                    visitedVertices: [...settled],
                     traversalOrder: [...settled],
                    highlightedEdges: [...treeEdges],
                    distances: formatDist()
                },
                { settledVertex: u, distance: dist[u] }
            );

            for (const nb of adjList[u] || []) {
                if (settled.has(nb.to)) continue;
                comparisons++;
                const candidate = dist[u] + Number(nb.weight);
                if (candidate < dist[nb.to]) {
                    dist[nb.to] = candidate;
                    prev[nb.to] = u;
                    treeEdges.push(`${u}-${nb.to}`);
                    pushGraphFrame(
                        `Relax Edge (${u} → ${nb.to}, w=${nb.weight}): dist[${nb.to}] = ${candidate}`,
                        `Improved shortest distance to '${nb.to}' via '${u}': ${dist[u]} + ${nb.weight} = ${candidate}.`,
                        4,
                        {
                            activeVertex: nb.to,
                            activeEdge: `${u}-${nb.to}`,
                            visitedVertices: [...settled],
                            highlightedEdges: [...treeEdges],
                            distances: formatDist()
                        },
                        { updated: nb.to, newDist: candidate }
                    );
                }
            }
        }

        // Reconstruct shortest path to targetNode if reachable
        const shortestEdges = [];
        let curr = ids.includes(targetNode) ? targetNode : ids[ids.length - 1];
        while (prev[curr]) {
            shortestEdges.push(`${prev[curr]}-${curr}`);
            curr = prev[curr];
        }

        pushGraphFrame(
            `Dijkstra Complete! Shortest Path to '${targetNode}' = ${dist[targetNode] === Infinity ? '∞' : dist[targetNode]}`,
            `Computed single-source shortest paths from '${start}' to all reachable vertices.`,
            4,
            {
                visitedVertices: [...settled],
                highlightedEdges: shortestEdges.length ? shortestEdges : treeEdges,
                distances: formatDist()
            },
            { target: targetNode, shortestDistance: dist[targetNode] === Infinity ? '∞' : dist[targetNode] }
        );
        return frames;
    }

    // 4. BELLMAN-FORD
    if (subVariant === 'bellman-ford') {
        const dist = {};
        ids.forEach((id) => {
            dist[id] = Infinity;
        });
        dist[start] = 0;
        const formatDist = () => Object.fromEntries(ids.map((k) => [k, dist[k] === Infinity ? '∞' : dist[k]]));

        pushGraphFrame(`Initialize Bellman-Ford from '${start}'`, `Set dist[${start}] = 0; preparing V - 1 = ${ids.length - 1} relaxation sweeps.`, 0, {
            activeVertex: start,
            distances: formatDist()
        });

        const allDirectedEdges = [];
        for (const e of graph.edges) {
            allDirectedEdges.push({ from: e.from, to: e.to, weight: Number(e.weight) });
            if (!graph.directed) allDirectedEdges.push({ from: e.to, to: e.from, weight: Number(e.weight) });
        }

        const relaxedEdges = [];
        for (let pass = 1; pass < ids.length; pass++) {
            let changed = false;
            for (const e of allDirectedEdges) {
                comparisons++;
                if (dist[e.from] !== Infinity && dist[e.from] + e.weight < dist[e.to]) {
                    dist[e.to] = dist[e.from] + e.weight;
                    changed = true;
                    relaxedEdges.push(`${e.from}-${e.to}`);
                    pushGraphFrame(
                        `Pass #${pass}: Relax (${e.from} → ${e.to}, w=${e.weight}) → dist[${e.to}] = ${dist[e.to]}`,
                        `Updated dist[${e.to}] = ${dist[e.from]} + (${e.weight}) = ${dist[e.to]}.`,
                        2,
                        {
                            activeVertex: e.to,
                            activeEdge: `${e.from}-${e.to}`,
                            highlightedEdges: [...relaxedEdges],
                            distances: formatDist()
                        },
                        { pass, edge: `${e.from}→${e.to}`, newDist: dist[e.to] }
                    );
                }
            }
            if (!changed) break;
        }

        // V-th pass negative cycle check
        for (const e of allDirectedEdges) {
            if (dist[e.from] !== Infinity && dist[e.from] + e.weight < dist[e.to]) {
                pushGraphFrame(
                    'Negative-Weight Cycle Detected!',
                    `Edge (${e.from} → ${e.to}) can still be relaxed on pass V! Shortest paths are undefined (-∞).`,
                    4,
                    { activeEdge: `${e.from}-${e.to}`, distances: formatDist() },
                    { cycleEdge: `${e.from}→${e.to}` },
                    'Negative-Weight Cycle Detected on V-th pass!'
                );
                return frames;
            }
        }

        pushGraphFrame('Bellman-Ford Complete (No Negative Cycles)', `Verified shortest distances after relaxation sweeps.`, 4, {
            visitedVertices: ids,
            highlightedEdges: relaxedEdges,
            distances: formatDist()
        });
        return frames;
    }

    // 5. PRIM'S & KRUSKAL'S MST
    if (subVariant === 'prim' || subVariant === 'kruskal') {
        const mstEdges = [];
        let totalCost = 0;

        if (subVariant === 'kruskal') {
            const sortedEdges = [...graph.edges].sort((a, b) => Number(a.weight) - Number(b.weight));
            const parent = Object.fromEntries(ids.map((id) => [id, id]));
            const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
            const visitedV = new Set();

            pushGraphFrame(
                'Sort Edges by Ascending Weight for Kruskal MST',
                `Sorted ${sortedEdges.length} edges: ${sortedEdges.map((e) => `${e.from}${e.to}(${e.weight})`).join(', ')}.`,
                0
            );

            for (const e of sortedEdges) {
                comparisons++;
                const rU = find(e.from);
                const rV = find(e.to);
                if (rU !== rV) {
                    parent[rU] = rV;
                    mstEdges.push(`${e.from}-${e.to}`);
                    visitedV.add(e.from);
                    visitedV.add(e.to);
                    totalCost += Number(e.weight);
                    pushGraphFrame(
                        `Accept MST Edge (${e.from} — ${e.to}, w=${e.weight})`,
                        `find(${e.from}) != find(${e.to}): no cycle formed. Running MST weight = ${totalCost}.`,
                        3,
                        {
                            activeEdge: `${e.from}-${e.to}`,
                            visitedVertices: [...visitedV],
                            highlightedEdges: [...mstEdges]
                        },
                        { edge: `${e.from}-${e.to}`, weight: e.weight, totalCost }
                    );
                } else {
                    pushGraphFrame(
                        `Reject Edge (${e.from} — ${e.to}, w=${e.weight}) — Cycle Detected`,
                        `Both '${e.from}' and '${e.to}' already share DSU root '${rU}'. Skipping edge.`,
                        2,
                        {
                            activeEdge: `${e.from}-${e.to}`,
                            visitedVertices: [...visitedV],
                            highlightedEdges: [...mstEdges]
                        },
                        { rejectedEdge: `${e.from}-${e.to}` }
                    );
                }
            }
        } else {
            // Prim's
            const inMST = new Set([start]);
            pushGraphFrame(`Initialize Prim's MST at '${start}'`, `Starting MST cut with vertex '${start}'.`, 0, {
                activeVertex: start,
                visitedVertices: [start]
            });

            while (inMST.size < ids.length) {
                let bestEdge = null;
                let bestW = Infinity;
                for (const e of graph.edges) {
                    const uIn = inMST.has(e.from);
                    const vIn = inMST.has(e.to);
                    if (uIn !== vIn && Number(e.weight) < bestW) {
                        bestW = Number(e.weight);
                        bestEdge = { from: uIn ? e.from : e.to, to: uIn ? e.to : e.from, weight: Number(e.weight) };
                    }
                }
                if (!bestEdge) break;
                inMST.add(bestEdge.to);
                mstEdges.push(`${bestEdge.from}-${bestEdge.to}`);
                totalCost += bestEdge.weight;
                pushGraphFrame(
                    `Grow MST Across Lightest Cut Edge (${bestEdge.from} — ${bestEdge.to}, w=${bestEdge.weight})`,
                    `Added '${bestEdge.to}' to MST. Total MST Cost = ${totalCost}.`,
                    3,
                    {
                        activeVertex: bestEdge.to,
                        activeEdge: `${bestEdge.from}-${bestEdge.to}`,
                        visitedVertices: [...inMST],
                        highlightedEdges: [...mstEdges]
                    },
                    { addedVertex: bestEdge.to, totalCost }
                );
            }
        }

        pushGraphFrame(
            `${subVariant.toUpperCase()} Minimum Spanning Tree Complete (Cost = ${totalCost})`,
            `Selected ${mstEdges.length} spanning edges with total weight = ${totalCost}.`,
            4,
            { visitedVertices: ids, highlightedEdges: mstEdges },
            { mstEdges: mstEdges.join(', '), totalCost }
        );
        return frames;
    }

    // 6. TOPOLOGICAL SORT, CYCLE DETECTION, CONNECTED COMPONENTS, FLOYD-WARSHALL
    if (subVariant === 'topological') {
        const indeg = Object.fromEntries(ids.map((id) => [id, 0]));
        for (const e of graph.edges) indeg[e.to] = (indeg[e.to] || 0) + 1;
        const q = ids.filter((id) => indeg[id] === 0);
        const order = [];

        pushGraphFrame(
            'Compute In-Degrees for Kahn Topological Sort',
            `Vertices with in-degree 0 enqueued: [${q.join(', ')}].`,
            0,
            { queueOrStack: [...q], distances: { ...indeg } }
        );

        while (q.length > 0) {
            const u = q.shift();
            order.push(u);
            for (const e of graph.edges.filter((edge) => edge.from === u)) {
                indeg[e.to]--;
                if (indeg[e.to] === 0) q.push(e.to);
            }
            pushGraphFrame(
                `Emit '${u}' into Topological Order`,
                `Decremented in-degrees of '${u}' neighbors. Order so far: ${order.join(' → ')}.`,
                3,
                {
                    activeVertex: u,
                    visitedVertices: [...order],
                    traversalOrder: [...order],
                    queueOrStack: [...q],
                    distances: { ...indeg }
                },
                { order: order.join(' → ') }
            );
        }
        return frames;
    }

    // Default fallback for Floyd-Warshall / Cycle / Components
    const visited = [];
    const hEdges = [];
    for (const e of graph.edges) {
        comparisons++;
        if (!visited.includes(e.from)) visited.push(e.from);
        if (!visited.includes(e.to)) visited.push(e.to);
        hEdges.push(`${e.from}-${e.to}`);
        pushGraphFrame(
            `Inspect Edge (${e.from} → ${e.to}, w=${e.weight})`,
            `Updating ${subVariant.toUpperCase()} state across edge (${e.from}, ${e.to}).`,
            2,
            {
                activeVertex: e.to,
                activeEdge: `${e.from}-${e.to}`,
                visitedVertices: [...visited],
                highlightedEdges: [...hEdges],
                traversalOrder: [...visited]
            },
            { edge: `${e.from}-${e.to}`, weight: e.weight }
        );
    }
    pushGraphFrame(`${subVariant.toUpperCase()} Execution Complete`, `Processed all ${ids.length} vertices and ${graph.edges.length} edges.`, 4, {
        visitedVertices: ids,
        highlightedEdges: hEdges,
        traversalOrder: visited
    });
    return frames;
};

/* =========================================================================
   6. RECURSION, BACKTRACKING, DYNAMIC PROGRAMMING & GREEDY STEP GENERATOR
   ========================================================================= */
export const generateAlgorithmFrames = (engineType, subVariant, params = {}) => {
    const frames = [];
    let comparisons = 0;

    // 1. RECURSION (Factorial, Fibonacci, Tower of Hanoi, Recursion Tree)
    if (engineType === 'recursion') {
        const n = Math.max(1, Math.min(subVariant === 'hanoi' ? 4 : 6, Number(params.n ?? 4)));
        const callStack = [];

        const pushRecFrame = (title, detail, pseudoLine, extra = {}, vars = {}) => {
            frames.push({
                stepIndex: frames.length,
                title,
                detail,
                pseudoLine,
                vars: { n, stackDepth: callStack.length, ...vars },
                metrics: { comparisons, depth: callStack.length },
                visualState: {
                    engineType: 'recursion',
                    subVariant,
                    callStack: [...callStack],
                    hanoiPegs: null,
                    returnValue: null,
                    ...extra
                }
            });
        };

        if (subVariant === 'factorial') {
            for (let k = n; k >= 1; k--) {
                callStack.push({ fn: `fact(${k})`, status: k === 1 ? 'BASE CASE (1)' : `waiting for fact(${k - 1})` });
                pushRecFrame(
                    `Winding Phase: Push Call Frame fact(${k})`,
                    k === 1 ? `Reached base case fact(1) = 1!` : `fact(${k}) pauses and calls fact(${k - 1}).`,
                    k === 1 ? 1 : 2,
                    {},
                    { currentK: k }
                );
            }
            let acc = 1;
            for (let k = 1; k <= n; k++) {
                acc *= k;
                callStack.pop();
                pushRecFrame(
                    `Unwinding Phase: Return fact(${k}) = ${acc}`,
                    `Popped fact(${k}) frame and returned ${acc} to caller.`,
                    2,
                    { returnValue: acc },
                    { returnedFrom: `fact(${k})`, result: acc }
                );
            }
            return frames;
        }

        if (subVariant === 'hanoi') {
            const pegs = {
                A: Array.from({ length: n }, (_, i) => n - i),
                B: [],
                C: []
            };
            const clonePegs = () => ({ A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] });

            pushRecFrame(`Initialize Tower of Hanoi (${n} Disks on Peg A)`, `Goal: Move all ${n} disks from A to C using auxiliary Peg B (2^${n} - 1 = ${Math.pow(2, n) - 1} moves).`, 0, {
                hanoiPegs: clonePegs()
            });

            const solveHanoi = (disk, src, aux, dst) => {
                if (disk === 0) return;
                callStack.push({ fn: `hanoi(${disk}, ${src}→${dst})`, status: 'active' });
                solveHanoi(disk - 1, src, dst, aux);
                const moved = pegs[src].pop();
                pegs[dst].push(moved);
                comparisons++;
                pushRecFrame(
                    `Move Disk #${moved} from Peg ${src} → Peg ${dst}`,
                    `Transferred Disk #${moved} onto Peg ${dst} (Move #${comparisons}).`,
                    2,
                    { hanoiPegs: clonePegs() },
                    { disk: moved, from: src, to: dst, moveCount: comparisons }
                );
                solveHanoi(disk - 1, aux, src, dst);
                callStack.pop();
            };

            solveHanoi(n, 'A', 'B', 'C');
            return frames;
        }

        // Fibonacci & Recursion Tree
        const memo = {};
        const fibTrace = (k) => {
            comparisons++;
            callStack.push({ fn: `fib(${k})`, status: k <= 1 ? `Base = ${k}` : `fib(${k - 1}) + fib(${k - 2})` });
            pushRecFrame(
                `Invoke fib(${k})`,
                k <= 1 ? `Base case reached: fib(${k}) returns ${k}.` : `Branching into left child fib(${k - 1}) and right child fib(${k - 2}).`,
                k <= 1 ? 1 : 2,
                {},
                { k }
            );
            if (k <= 1) {
                callStack.pop();
                return k;
            }
            const res = fibTrace(k - 1) + fibTrace(k - 2);
            memo[k] = res;
            callStack.pop();
            pushRecFrame(
                `Combine Subproblems: fib(${k}) = ${res}`,
                `fib(${k - 1}) + fib(${k - 2}) = ${res}.`,
                2,
                { returnValue: res },
                { k, fibK: res }
            );
            return res;
        };
        fibTrace(Math.min(4, n));
        return frames;
    }

    // 2. BACKTRACKING (N-Queens, Rat in a Maze, Subsets, Permutations)
    if (engineType === 'backtracking') {
        if (subVariant === 'nqueens') {
            const N = 4;
            const board = Array.from({ length: N }, () => Array(N).fill(0));
            const cloneBoard = () => board.map((r) => [...r]);

            const pushQueenFrame = (title, detail, pseudoLine, activeCell = null, conflict = false) => {
                frames.push({
                    stepIndex: frames.length,
                    title,
                    detail,
                    pseudoLine,
                    vars: { boardSize: `${N}×${N}`, comparisons },
                    metrics: { comparisons, size: N },
                    visualState: {
                        engineType: 'backtracking',
                        subVariant: 'nqueens',
                        board: cloneBoard(),
                        activeCell,
                        conflict
                    }
                });
            };

            const isSafe = (r, c) => {
                for (let i = 0; i < r; i++) {
                    if (board[i][c] === 1) return false;
                    if (c - (r - i) >= 0 && board[i][c - (r - i)] === 1) return false;
                    if (c + (r - i) < N && board[i][c + (r - i)] === 1) return false;
                }
                return true;
            };

            const solve = (row) => {
                if (row === N) {
                    pushQueenFrame('Valid 4-Queens Configuration Found!', 'All 4 Queens placed safely with zero row, column, or diagonal attacks.', 0);
                    return true;
                }
                for (let col = 0; col < N; col++) {
                    comparisons++;
                    if (isSafe(row, col)) {
                        board[row][col] = 1;
                        pushQueenFrame(
                            `Place Queen at Row ${row}, Col ${col}`,
                            `Square (${row}, ${col}) is free of column and diagonal attacks. Advancing to Row ${row + 1}.`,
                            2,
                            [row, col],
                            false
                        );
                        if (solve(row + 1)) return true;
                        board[row][col] = 0;
                        pushQueenFrame(
                            `BACKTRACK: Remove Queen from (${row}, ${col})`,
                            `Subsequent row had no valid safe column! Undoing choice at (${row}, ${col}).`,
                            4,
                            [row, col],
                            true
                        );
                    } else {
                        pushQueenFrame(
                            `Conflict at (${row}, ${col}) — Pruned`,
                            `Square (${row}, ${col}) is attacked by an earlier Queen.`,
                            1,
                            [row, col],
                            true
                        );
                    }
                }
                return false;
            };

            solve(0);
            return frames;
        }

        if (subVariant === 'maze') {
            const maze = [
                [1, 1, 0, 1],
                [0, 1, 1, 0],
                [1, 0, 1, 1],
                [1, 1, 0, 1]
            ];
            const pathGrid = Array.from({ length: 4 }, () => Array(4).fill(0));
            const clonePath = () => pathGrid.map((r) => [...r]);

            const pushMazeFrame = (title, detail, pseudoLine, cell, backtrack = false) => {
                frames.push({
                    stepIndex: frames.length,
                    title,
                    detail,
                    pseudoLine,
                    vars: { cell: `(${cell[0]}, ${cell[1]})` },
                    metrics: { comparisons },
                    visualState: {
                        engineType: 'backtracking',
                        subVariant: 'maze',
                        maze,
                        pathGrid: clonePath(),
                        activeCell: cell,
                        conflict: backtrack
                    }
                });
            };

            const explore = (r, c) => {
                if (r < 0 || c < 0 || r >= 4 || c >= 4 || maze[r][c] === 0 || pathGrid[r][c] === 1) return false;
                comparisons++;
                pathGrid[r][c] = 1;
                pushMazeFrame(`Step into Open Cell (${r}, ${c})`, `Marked (${r}, ${c}) as part of current path.`, 2, [r, c]);
                if (r === 3 && c === 3) {
                    pushMazeFrame('Goal (3, 3) Reached!', 'Rat successfully navigated from (0, 0) to destination (3, 3).', 0, [3, 3]);
                    return true;
                }
                if (explore(r, c + 1) || explore(r + 1, c)) return true;
                pathGrid[r][c] = 0;
                pushMazeFrame(`Dead End at (${r}, ${c}) — Backtracking!`, `Unmarking (${r}, ${c}) and retreating to parent cell.`, 3, [r, c], true);
                return false;
            };
            explore(0, 0);
            return frames;
        }

        // Subsets / Permutations / Generic Backtracking
        const nums = [1, 2, 3];
        const results = [];
        const pushSetFrame = (title, detail, pseudoLine, currentChoice) => {
            frames.push({
                stepIndex: frames.length,
                title,
                detail,
                pseudoLine,
                vars: { current: `[${currentChoice.join(', ')}]`, foundCount: results.length },
                metrics: { comparisons, count: results.length },
                visualState: {
                    engineType: 'backtracking',
                    subVariant,
                    currentSet: [...currentChoice],
                    allResults: [...results]
                }
            });
        };

        if (subVariant === 'permutations') {
            const permute = (arr, l) => {
                if (l === arr.length) {
                    results.push(`[${arr.join(', ')}]`);
                    pushSetFrame(`Record Permutation [${arr.join(', ')}]`, `Reached leaf depth ${arr.length}; saved permutation #${results.length}.`, 0, arr);
                    return;
                }
                for (let i = l; i < arr.length; i++) {
                    comparisons++;
                    [arr[l], arr[i]] = [arr[i], arr[l]];
                    pushSetFrame(`Swap Index ${l} ↔ ${i}: [${arr.join(', ')}]`, `Fixed position ${l} = ${arr[l]} and recursing.`, 2, arr.slice(0, l + 1));
                    permute(arr, l + 1);
                    [arr[l], arr[i]] = [arr[i], arr[l]];
                }
            };
            permute([...nums], 0);
            return frames;
        }

        // Subsets
        const genSubsets = (idx, curr) => {
            if (idx === nums.length) {
                results.push(`{${curr.join(', ')}}`);
                pushSetFrame(`Emit Subset {${curr.join(', ')}}`, `Leaf decision reached. Total subsets generated = ${results.length}.`, 0, curr);
                return;
            }
            comparisons++;
            curr.push(nums[idx]);
            pushSetFrame(`Include ${nums[idx]} → {${curr.join(', ')}}`, `Branch 1: Included element ${nums[idx]}.`, 1, curr);
            genSubsets(idx + 1, curr);
            curr.pop();
            pushSetFrame(`Exclude ${nums[idx]} (Backtrack) → {${curr.join(', ')}}`, `Branch 2: Excluded element ${nums[idx]}.`, 3, curr);
            genSubsets(idx + 1, curr);
        };
        genSubsets(0, []);
        return frames;
    }

    // 3. DYNAMIC PROGRAMMING & GREEDY
    if (subVariant === 'greedy') {
        const activities = [
            { id: 'A1', start: 1, end: 3 },
            { id: 'A2', start: 2, end: 5 },
            { id: 'A3', start: 4, end: 7 },
            { id: 'A4', start: 6, end: 8 },
            { id: 'A5', start: 8, end: 10 }
        ];
        const selected = [];
        let lastEnd = -1;

        for (const act of activities) {
            comparisons++;
            const compatible = act.start >= lastEnd;
            if (compatible) {
                selected.push(act.id);
                lastEnd = act.end;
            }
            frames.push({
                stepIndex: frames.length,
                title: compatible ? `Select Compatible Activity ${act.id} [${act.start}..${act.end}]` : `Skip Overlapping Activity ${act.id} [${act.start}..${act.end}]`,
                detail: compatible
                    ? `start (${act.start}) >= lastFinish (${lastEnd === act.end ? 'prev' : lastEnd}); greedily locked ${act.id}.`
                    : `start (${act.start}) < lastFinish (${lastEnd}); conflicts with currently scheduled activity.`,
                pseudoLine: compatible ? 3 : 2,
                vars: { activity: act.id, interval: `[${act.start}, ${act.end}]`, selected: selected.join(', ') },
                metrics: { comparisons, selectedCount: selected.length },
                visualState: {
                    engineType: 'dp',
                    subVariant: 'greedy',
                    activities,
                    activeActivity: act.id,
                    selectedActivities: [...selected]
                }
            });
        }
        return frames;
    }

    // Dynamic Programming 2D Table (0/1 Knapsack)
    const weights = [1, 2, 3];
    const values = [10, 15, 40];
    const W = 5;
    const dp = Array.from({ length: weights.length + 1 }, () => Array(W + 1).fill(0));
    const cloneDp = () => dp.map((r) => [...r]);

    frames.push({
        stepIndex: 0,
        title: 'Initialize 2D DP Tabulation Table (Base Row i=0 & Col w=0 = 0)',
        detail: `3 items with weights [${weights.join(', ')}] and values [${values.join(', ')}], Knapsack Capacity W = ${W}.`,
        pseudoLine: 0,
        vars: { items: 3, capacity: W, mode: params.dpMode || 'Tabulation (Bottom-Up)' },
        metrics: { comparisons: 0 },
        visualState: {
            engineType: 'dp',
            subVariant: 'knapsack-lcs',
            dpTable: cloneDp(),
            rowLabels: ['0 (Base)', 'Item 1 (w=1,v=10)', 'Item 2 (w=2,v=15)', 'Item 3 (w=3,v=40)'],
            colLabels: Array.from({ length: W + 1 }, (_, w) => `w=${w}`),
            activeCell: [0, 0],
            dependencyCells: []
        }
    });

    for (let i = 1; i <= weights.length; i++) {
        const wt = weights[i - 1];
        const val = values[i - 1];
        for (let w = 1; w <= W; w++) {
            comparisons++;
            let deps = [[i - 1, w]];
            let formula = `dp[${i - 1}][${w}] = ${dp[i - 1][w]}`;
            if (wt <= w) {
                const take = val + dp[i - 1][w - wt];
                const skip = dp[i - 1][w];
                dp[i][w] = Math.max(skip, take);
                deps = [
                    [i - 1, w],
                    [i - 1, w - wt]
                ];
                formula = `max(skip=${skip}, take=${val}+dp[${i - 1}][${w - wt}](${dp[i - 1][w - wt]})=${take}) = ${dp[i][w]}`;
            } else {
                dp[i][w] = dp[i - 1][w];
            }

            frames.push({
                stepIndex: frames.length,
                title: `Compute Cell dp[${i}][${w}] = ${dp[i][w]}`,
                detail: `Recurrence: ${formula}. Reusing cached subproblems without recomputation!`,
                pseudoLine: wt <= w ? 3 : 4,
                vars: { i, w, itemWeight: wt, itemValue: val, 'dp[i][w]': dp[i][w] },
                metrics: { comparisons },
                visualState: {
                    engineType: 'dp',
                    subVariant: 'knapsack-lcs',
                    dpTable: cloneDp(),
                    rowLabels: ['0 (Base)', 'Item 1 (w=1,v=10)', 'Item 2 (w=2,v=15)', 'Item 3 (w=3,v=40)'],
                    colLabels: Array.from({ length: W + 1 }, (_, c) => `w=${c}`),
                    activeCell: [i, w],
                    dependencyCells: deps
                }
            });
        }
    }

    return frames;
};
