/**
 * lib/content.ts — Single Source of Truth for ALL PlacementHub Content
 *
 * Architecture:
 *   Category → Topic → Question
 *   Company  → CompanyQuestion → Question (same Question pool)
 *
 * One question can appear in:
 *   - Placement Prep (by topicId)
 *   - Any company's question bank (by companyId via CompanyQuestion)
 *   - Assessments (by categoryId + difficulty)
 *   - Interview Prep (by type = 'theory')
 *
 * NEVER duplicate question content — add a CompanyQuestion mapping instead.
 */

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Importance = 'Low' | 'Medium' | 'High' | 'Critical';
export type TopicLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Placement Essential';
export type QuestionType = 'mcq' | 'coding' | 'theory' | 'sql' | 'system-design';
export type CompanyCategory = 'Product Giants' | 'Indian Unicorns' | 'Service & Consultancies' | 'Fintech & Quant';

export interface Category {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
  tagline: string;
  order: number;
  totalTopics: number;
}

export interface Topic {
  id: string;
  categoryId: string;
  name: string;
  level: TopicLevel;
  importance: Importance;
  description: string;
  keyPoints: string[];
  subtopics: string[];
  order: number;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: Difficulty;
  topicIds: string[];    // belongs to one or more topics
  categoryId: string;
  options?: string[];    // for MCQ
  correctOption?: number; // 0-indexed
  solutionHint: string;
  explanation: string;
  tags: string[];
  source: string;
  year?: string;
  role?: string;
  round?: string;
  verified: boolean;
  frequencyCount: number; // total company interview reports citing this question
}

export interface CompanyQuestion {
  companyId: string;
  questionId: string;
  role?: string;
  round?: string;
  year?: string;
  frequency: number;
  verified: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  category: CompanyCategory;
  difficulty: 'Easy' | 'Medium' | 'Medium-Hard' | 'Hard';
  color: string;
  avgPackage: string;
  eligibility: string;
  rounds: string[];
  focusTopics: string[];
  focusCategoryIds: string[];
  readiness: number;
  pastQuestionsCount: number;
  overview: string;
}

// ─────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    shortName: 'DSA',
    icon: '🔷',
    color: '#635bff',
    description: 'Arrays, Trees, Graphs, DP — the foundation of every coding interview.',
    tagline: 'Most critical for tech interviews',
    order: 1,
    totalTopics: 22,
  },
  {
    id: 'cs-core',
    name: 'CS Core Fundamentals',
    shortName: 'CS Core',
    icon: '🖥️',
    color: '#38bdf8',
    description: 'DBMS, Operating Systems, Computer Networks, OOP — core CS theory for technical rounds.',
    tagline: 'Essential for all tech companies',
    order: 2,
    totalTopics: 30,
  },
  {
    id: 'sql',
    name: 'SQL & Databases',
    shortName: 'SQL',
    icon: '🗃️',
    color: '#a78bfa',
    description: 'SELECT to Window Functions — SQL is tested by 90% of companies.',
    tagline: 'Tested at every company',
    order: 3,
    totalTopics: 14,
  },
  {
    id: 'system-design',
    name: 'System Design',
    shortName: 'Sys Design',
    icon: '🔐',
    color: '#f59e0b',
    description: 'Fundamentals, LLD, HLD, and classic design problems.',
    tagline: 'Required for SDE-2+ & Product companies',
    order: 4,
    totalTopics: 18,
  },
  {
    id: 'aptitude',
    name: 'Aptitude & Reasoning',
    shortName: 'Aptitude',
    icon: '🧮',
    color: '#10b981',
    description: 'Quantitative, Logical, and Verbal — cleared in Round 1 of most service companies.',
    tagline: 'Mandatory for service-based companies',
    order: 5,
    totalTopics: 16,
  },
];

// ─────────────────────────────────────────────────────────────────
// TOPICS
// ─────────────────────────────────────────────────────────────────

export const TOPICS: Topic[] = [

  // ── DSA ──────────────────────────────────────────────────────
  {
    id: 'dsa-complexity',
    categoryId: 'dsa',
    name: 'Time & Space Complexity',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Big-O, Big-Theta, Big-Omega analysis. Mastering this is non-negotiable before coding interviews.',
    keyPoints: ['Big-O notation', 'Best/Average/Worst case', 'Space complexity', 'Amortized analysis', 'Common complexities: O(1), O(log n), O(n), O(n log n), O(n²)'],
    subtopics: ['Big-O Notation', 'Time Complexity Analysis', 'Space Complexity', 'Amortized Analysis', 'Recurrence Relations'],
    order: 1,
  },
  {
    id: 'dsa-arrays',
    categoryId: 'dsa',
    name: 'Arrays',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Foundation of all data structures. Prefix sums, two pointers, sorting tricks.',
    keyPoints: ['Prefix sum', 'Kadane\'s algorithm', 'Dutch national flag', 'Rotation tricks', 'Subarray problems'],
    subtopics: ['1D Arrays', '2D Arrays / Matrix', 'Prefix Sum', 'Sliding Window on Arrays', 'Kadane\'s Algorithm', 'Sorting Tricks'],
    order: 2,
  },
  {
    id: 'dsa-strings',
    categoryId: 'dsa',
    name: 'Strings',
    level: 'Beginner',
    importance: 'High',
    description: 'String manipulation, pattern matching, anagram detection, palindrome problems.',
    keyPoints: ['String traversal', 'Two pointers on strings', 'KMP algorithm', 'Rabin-Karp', 'Character frequency maps'],
    subtopics: ['String Basics', 'Two Pointers on Strings', 'Pattern Matching (KMP)', 'Anagram & Palindrome', 'String DP'],
    order: 3,
  },
  {
    id: 'dsa-hashing',
    categoryId: 'dsa',
    name: 'Hashing',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Hash maps and hash sets for O(1) lookups. Essential in almost every coding problem.',
    keyPoints: ['HashMap vs HashSet', 'Collision resolution', 'Two-sum pattern', 'Frequency counting', 'Sliding window with hash map'],
    subtopics: ['Hash Map Basics', 'Hash Set', 'Collision Handling', 'Frequency Count Pattern', 'Anagram Detection'],
    order: 4,
  },
  {
    id: 'dsa-two-pointers',
    categoryId: 'dsa',
    name: 'Two Pointers',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'Classic two-pointer patterns: left-right scan, fast-slow pointer.',
    keyPoints: ['Left-right scan', 'Fast & slow pointers', 'Three-sum pattern', 'Container with most water', 'Remove duplicates'],
    subtopics: ['Left-Right Pointer', 'Fast-Slow Pointer', '3-Sum & Variants', 'Partitioning Problems'],
    order: 5,
  },
  {
    id: 'dsa-sliding-window',
    categoryId: 'dsa',
    name: 'Sliding Window',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'Fixed and variable size windows for subarray/substring problems.',
    keyPoints: ['Fixed size window', 'Variable size window', 'Shrink when invalid', 'Max/Min in window (deque)'],
    subtopics: ['Fixed Window', 'Variable Window', 'Window + Hash Map', 'Monotonic Deque Window'],
    order: 6,
  },
  {
    id: 'dsa-linked-list',
    categoryId: 'dsa',
    name: 'Linked List',
    level: 'Intermediate',
    importance: 'High',
    description: 'Singly, doubly, circular linked lists. Reversal, cycle detection, merge.',
    keyPoints: ['Reversal patterns', 'Floyd\'s cycle detection', 'Merging two lists', 'Finding middle node', 'LRU Cache implementation'],
    subtopics: ['Singly Linked List', 'Doubly Linked List', 'Cycle Detection (Floyd)', 'Reversal Problems', 'Merge & Sort'],
    order: 7,
  },
  {
    id: 'dsa-stack',
    categoryId: 'dsa',
    name: 'Stack',
    level: 'Intermediate',
    importance: 'High',
    description: 'Monotonic stacks, balanced parentheses, expression evaluation.',
    keyPoints: ['LIFO principle', 'Monotonic stack', 'Balanced parentheses', 'Next greater element', 'Histogram problems'],
    subtopics: ['Stack Basics', 'Monotonic Stack', 'Parentheses Problems', 'Expression Evaluation', 'Histogram & Area Problems'],
    order: 8,
  },
  {
    id: 'dsa-queue',
    categoryId: 'dsa',
    name: 'Queue & Deque',
    level: 'Intermediate',
    importance: 'Medium',
    description: 'BFS, sliding window maximum, circular queue implementations.',
    keyPoints: ['FIFO principle', 'BFS traversal', 'Circular queue', 'Deque for sliding window', 'Priority queue basics'],
    subtopics: ['Queue Basics', 'BFS with Queue', 'Deque (Double-ended Queue)', 'Circular Queue', 'Sliding Window Maximum'],
    order: 9,
  },
  {
    id: 'dsa-recursion',
    categoryId: 'dsa',
    name: 'Recursion',
    level: 'Intermediate',
    importance: 'High',
    description: 'Recursive thinking, call stack, base cases. Gateway to backtracking and tree problems.',
    keyPoints: ['Base case + recursive case', 'Call stack visualization', 'Tail recursion', 'Memoization basics', 'Tree recursion pattern'],
    subtopics: ['Recursive Thinking', 'Base Cases', 'Recursive Trees', 'Memoization Introduction', 'Power Set Pattern'],
    order: 10,
  },
  {
    id: 'dsa-backtracking',
    categoryId: 'dsa',
    name: 'Backtracking',
    level: 'Advanced',
    importance: 'High',
    description: 'Exhaustive search with pruning: N-Queens, Sudoku, Permutations.',
    keyPoints: ['Choose-explore-unchoose pattern', 'Pruning the search space', 'N-Queens', 'Subset sum', 'Permutation & combination generation'],
    subtopics: ['Backtracking Template', 'Permutations', 'Combinations & Subsets', 'N-Queens', 'Sudoku Solver', 'Word Search'],
    order: 11,
  },
  {
    id: 'dsa-sorting',
    categoryId: 'dsa',
    name: 'Sorting Algorithms',
    level: 'Beginner',
    importance: 'High',
    description: 'Bubble, Selection, Insertion, Merge, Quick, Heap sort. Time complexities.',
    keyPoints: ['Merge sort O(n log n)', 'Quick sort O(n log n) avg', 'Counting sort O(n+k)', 'When to use which sort', 'Stability of sort'],
    subtopics: ['Bubble & Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort', 'Counting & Radix Sort'],
    order: 12,
  },
  {
    id: 'dsa-binary-search',
    categoryId: 'dsa',
    name: 'Binary Search',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'Binary search on sorted arrays and on answer space.',
    keyPoints: ['Left/right boundary', 'Binary search on answer', 'Rotated sorted array', 'Peak finding', 'sqrt(x) approximation'],
    subtopics: ['Classic Binary Search', 'First/Last Occurrence', 'Search in Rotated Array', 'Binary Search on Answer', 'Peak Element'],
    order: 13,
  },
  {
    id: 'dsa-trees',
    categoryId: 'dsa',
    name: 'Binary Trees',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'Tree traversals (DFS/BFS), height, diameter, LCA, path problems.',
    keyPoints: ['Inorder/Preorder/Postorder', 'Level order BFS', 'Diameter of tree', 'LCA (Lowest Common Ancestor)', 'Path sum problems'],
    subtopics: ['Tree Traversals', 'Level Order BFS', 'Tree Height & Depth', 'Diameter & Path Sum', 'LCA', 'Tree Construction'],
    order: 14,
  },
  {
    id: 'dsa-bst',
    categoryId: 'dsa',
    name: 'Binary Search Tree',
    level: 'Intermediate',
    importance: 'High',
    description: 'BST property, insertion, deletion, inorder traversal gives sorted order.',
    keyPoints: ['BST property', 'Insert, delete, search', 'Inorder gives sorted array', 'Balanced BST (AVL, Red-Black)', 'Kth smallest element'],
    subtopics: ['BST Operations', 'BST Validation', 'Kth Smallest/Largest', 'BST to Array', 'Self-balancing BSTs'],
    order: 15,
  },
  {
    id: 'dsa-heap',
    categoryId: 'dsa',
    name: 'Heap / Priority Queue',
    level: 'Advanced',
    importance: 'High',
    description: 'Min-heap, max-heap, top-K problems, merge K sorted lists.',
    keyPoints: ['Heap property', 'Heapify O(n)', 'Top-K elements', 'Kth largest in stream', 'Merge K sorted lists'],
    subtopics: ['Min-Heap & Max-Heap', 'Heapify', 'Top-K Problems', 'Kth Largest in Stream', 'Merge K Lists'],
    order: 16,
  },
  {
    id: 'dsa-greedy',
    categoryId: 'dsa',
    name: 'Greedy Algorithms',
    level: 'Advanced',
    importance: 'High',
    description: 'Activity selection, interval problems, gas station, jump game.',
    keyPoints: ['Local optimal → global optimal', 'Interval scheduling', 'Fractional knapsack', 'Huffman encoding', 'Jump game'],
    subtopics: ['Activity Selection', 'Interval Merging', 'Jump Game', 'Fractional Knapsack', 'Huffman Encoding'],
    order: 17,
  },
  {
    id: 'dsa-graphs',
    categoryId: 'dsa',
    name: 'Graphs',
    level: 'Advanced',
    importance: 'Critical',
    description: 'BFS, DFS, Dijkstra, Topological Sort, Union-Find, Bellman-Ford.',
    keyPoints: ['Graph representation (adjacency list/matrix)', 'BFS & DFS traversal', 'Dijkstra\'s shortest path', 'Topological sort (Kahn\'s + DFS)', 'Union-Find (DSU)', 'Cycle detection'],
    subtopics: ['Graph Representation', 'BFS & DFS', 'Shortest Path (Dijkstra)', 'Bellman-Ford', 'Topological Sort', 'Union-Find DSU', 'MST (Kruskal/Prim)', 'Cycle Detection'],
    order: 18,
  },
  {
    id: 'dsa-dp',
    categoryId: 'dsa',
    name: 'Dynamic Programming',
    level: 'Advanced',
    importance: 'Critical',
    description: '0/1 Knapsack, LCS, LIS, matrix DP, interval DP, tree DP.',
    keyPoints: ['Overlapping subproblems', 'Optimal substructure', 'Memoization (top-down)', 'Tabulation (bottom-up)', 'State definition', '0/1 Knapsack, LCS, LIS patterns'],
    subtopics: ['DP Fundamentals', '1D DP (Fibonacci, Coin Change)', '2D DP (Grid, LCS)', '0/1 Knapsack', 'LIS & LCS', 'Interval DP', 'Tree DP', 'Digit DP'],
    order: 19,
  },
  {
    id: 'dsa-bit-manipulation',
    categoryId: 'dsa',
    name: 'Bit Manipulation',
    level: 'Advanced',
    importance: 'Medium',
    description: 'AND, OR, XOR, shifts, bit masking tricks.',
    keyPoints: ['AND, OR, XOR, NOT operators', 'Left/right shift', 'Set/clear/toggle bit', 'Count set bits (Brian Kernighan)', 'Power of 2 check', 'XOR for unique element'],
    subtopics: ['Bitwise Operators', 'Bit Masking', 'Count Set Bits', 'XOR Tricks', 'Power of 2', 'Subsets using Bitmask'],
    order: 20,
  },
  {
    id: 'dsa-trie',
    categoryId: 'dsa',
    name: 'Tries',
    level: 'Advanced',
    importance: 'Medium',
    description: 'Prefix tree for string search, autocomplete, longest prefix matching.',
    keyPoints: ['TrieNode structure', 'Insert & search O(L)', 'Autocomplete', 'Longest common prefix', 'Word search with Trie'],
    subtopics: ['Trie Implementation', 'Prefix Search', 'Autocomplete', 'Word Dictionary', 'XOR Trie (Max XOR)'],
    order: 21,
  },
  {
    id: 'dsa-advanced',
    categoryId: 'dsa',
    name: 'Advanced Data Structures',
    level: 'Advanced',
    importance: 'Low',
    description: 'Segment Tree, Fenwick Tree, Sparse Table for range queries.',
    keyPoints: ['Segment Tree for range sum/min/max', 'Fenwick Tree (BIT) for prefix sum', 'Sparse Table for range min/max', 'Disjoint Set Union advanced', 'Suffix Array'],
    subtopics: ['Segment Tree', 'Fenwick Tree (BIT)', 'Sparse Table', 'Suffix Array & SAM', 'Heavy-Light Decomposition'],
    order: 22,
  },

  // ── CS CORE — DBMS ───────────────────────────────────────────
  {
    id: 'dbms-fundamentals',
    categoryId: 'cs-core',
    name: 'Database Fundamentals',
    level: 'Beginner',
    importance: 'High',
    description: 'What is a database, DBMS vs file system, relational model basics.',
    keyPoints: ['DBMS vs file system', 'Relational model', 'Schema & instance', 'DDL vs DML', 'Types of databases'],
    subtopics: ['DBMS Overview', 'Relational Model', 'DDL & DML', 'Database Schema'],
    order: 1,
  },
  {
    id: 'dbms-keys',
    categoryId: 'cs-core',
    name: 'Keys & Constraints',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Primary key, foreign key, candidate key, super key, unique, NOT NULL.',
    keyPoints: ['Super key → Candidate key → Primary key', 'Foreign key & referential integrity', 'Unique constraint', 'Composite key', 'Surrogate vs natural key'],
    subtopics: ['Super Key', 'Candidate Key', 'Primary Key', 'Foreign Key', 'Composite Key', 'Surrogate Key'],
    order: 2,
  },
  {
    id: 'dbms-er',
    categoryId: 'cs-core',
    name: 'ER Model',
    level: 'Beginner',
    importance: 'Medium',
    description: 'Entity-Relationship diagrams, cardinality, participation constraints.',
    keyPoints: ['Entities & attributes', 'Relationships (1:1, 1:N, M:N)', 'Strong vs weak entity', 'Participation constraint (total/partial)', 'ER to relational schema conversion'],
    subtopics: ['Entities & Attributes', 'Relationships & Cardinality', 'Weak Entities', 'ER to Schema Mapping'],
    order: 3,
  },
  {
    id: 'dbms-normalization',
    categoryId: 'cs-core',
    name: 'Normalization',
    level: 'Intermediate',
    importance: 'Critical',
    description: '1NF through BCNF. Eliminating redundancy and anomalies.',
    keyPoints: ['Functional dependencies', '1NF: atomic values', '2NF: no partial dependency', '3NF: no transitive dependency', 'BCNF: every determinant is a candidate key', 'Denormalization trade-offs'],
    subtopics: ['Functional Dependencies', '1NF', '2NF', '3NF', 'BCNF', 'Denormalization'],
    order: 4,
  },
  {
    id: 'dbms-sql-basics',
    categoryId: 'cs-core',
    name: 'SQL Basics',
    level: 'Beginner',
    importance: 'Critical',
    description: 'SELECT, WHERE, ORDER BY, GROUP BY, HAVING, aggregate functions.',
    keyPoints: ['SELECT query structure', 'WHERE filter', 'GROUP BY + HAVING', 'Aggregate: COUNT, SUM, AVG, MIN, MAX', 'ORDER BY ASC/DESC'],
    subtopics: ['SELECT & FROM', 'WHERE Clause', 'ORDER BY', 'GROUP BY & HAVING', 'Aggregate Functions'],
    order: 5,
  },
  {
    id: 'dbms-joins',
    categoryId: 'cs-core',
    name: 'SQL Joins',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF joins.',
    keyPoints: ['INNER JOIN (only matching rows)', 'LEFT JOIN (all from left)', 'RIGHT JOIN (all from right)', 'FULL OUTER JOIN', 'SELF JOIN on same table', 'Cross join (cartesian product)'],
    subtopics: ['INNER JOIN', 'LEFT & RIGHT JOIN', 'FULL OUTER JOIN', 'SELF JOIN', 'CROSS JOIN', 'Join on Multiple Conditions'],
    order: 6,
  },
  {
    id: 'dbms-transactions',
    categoryId: 'cs-core',
    name: 'Transactions & ACID',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'ACID properties, commit, rollback, savepoints, isolation levels.',
    keyPoints: ['Atomicity: all or nothing', 'Consistency: valid state', 'Isolation: concurrent safety', 'Durability: persisted commits', 'Isolation levels: READ UNCOMMITTED → SERIALIZABLE', 'Phantom read, dirty read, non-repeatable read'],
    subtopics: ['ACID Properties', 'Transactions (COMMIT/ROLLBACK)', 'Isolation Levels', 'Dirty & Phantom Reads', 'Savepoints'],
    order: 7,
  },
  {
    id: 'dbms-indexing',
    categoryId: 'cs-core',
    name: 'Indexing',
    level: 'Intermediate',
    importance: 'High',
    description: 'B+ Tree indexes, clustered vs non-clustered, composite indexes, query optimization.',
    keyPoints: ['B+ Tree structure', 'Clustered vs non-clustered index', 'Primary vs secondary index', 'Index selectivity', 'When NOT to use an index'],
    subtopics: ['B-Tree Index', 'B+ Tree', 'Clustered vs Non-Clustered', 'Composite Index', 'Hash Index', 'Index Cost Trade-offs'],
    order: 8,
  },
  {
    id: 'dbms-concurrency',
    categoryId: 'cs-core',
    name: 'Concurrency Control',
    level: 'Intermediate',
    importance: 'High',
    description: 'Locking, deadlock, 2PL, MVCC, optimistic vs pessimistic concurrency.',
    keyPoints: ['Shared vs exclusive locks', 'Two-Phase Locking (2PL)', 'Deadlock detection & prevention', 'MVCC (Multiversion Concurrency Control)', 'Optimistic concurrency control'],
    subtopics: ['Shared & Exclusive Locks', 'Two-Phase Locking', 'Deadlock in DB', 'MVCC', 'Timestamp-based Protocol'],
    order: 9,
  },

  // ── CS CORE — OPERATING SYSTEMS ──────────────────────────────
  {
    id: 'os-processes',
    categoryId: 'cs-core',
    name: 'Processes & Threads',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Process vs thread, PCB, context switching, process states.',
    keyPoints: ['Process = program in execution', 'Thread = lightweight process sharing memory', 'PCB (Process Control Block)', 'Process states: New, Ready, Running, Blocked, Terminated', 'Context switch overhead'],
    subtopics: ['Process Concept', 'Process States & PCB', 'Thread vs Process', 'User vs Kernel Threads', 'Multithreading Models'],
    order: 10,
  },
  {
    id: 'os-scheduling',
    categoryId: 'cs-core',
    name: 'CPU Scheduling',
    level: 'Intermediate',
    importance: 'High',
    description: 'FCFS, SJF, Round Robin, Priority Scheduling, MLFQ. Gantt charts.',
    keyPoints: ['FCFS: simple but convoy effect', 'SJF: optimal avg wait but requires burst time', 'Round Robin: time quantum', 'Priority scheduling: starvation → aging', 'MLFQ: adaptive quantum'],
    subtopics: ['FCFS & SJF', 'Round Robin', 'Priority Scheduling', 'MLFQ', 'Scheduling Metrics (Turnaround, Waiting, Response Time)'],
    order: 11,
  },
  {
    id: 'os-synchronization',
    categoryId: 'cs-core',
    name: 'Process Synchronization',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'Race conditions, critical section, mutex, semaphore, monitors.',
    keyPoints: ['Race condition', 'Critical section problem (Mutual Exclusion, Progress, Bounded Wait)', 'Mutex vs Binary Semaphore', 'Counting semaphore', 'Monitor construct', 'Spinlock vs blocking'],
    subtopics: ['Race Conditions', 'Critical Section', 'Mutex & Semaphore', 'Monitors', 'Classic Problems (Producer-Consumer, Readers-Writers, Dining Philosophers)'],
    order: 12,
  },
  {
    id: 'os-deadlocks',
    categoryId: 'cs-core',
    name: 'Deadlocks',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'Coffman conditions, prevention, avoidance (Banker\'s), detection, recovery.',
    keyPoints: ['4 Coffman Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait', 'Deadlock prevention: break one condition', 'Banker\'s Algorithm for avoidance', 'Resource Allocation Graph (RAG)', 'Detection & Recovery'],
    subtopics: ['Coffman Conditions', 'Deadlock Prevention', 'Banker\'s Algorithm', 'Resource Allocation Graph', 'Deadlock Detection & Recovery'],
    order: 13,
  },
  {
    id: 'os-memory',
    categoryId: 'cs-core',
    name: 'Memory Management',
    level: 'Intermediate',
    importance: 'High',
    description: 'Paging, segmentation, virtual memory, page replacement algorithms.',
    keyPoints: ['Logical vs physical address space', 'Paging & page tables', 'TLB (Translation Lookaside Buffer)', 'Segmentation', 'Page replacement: FIFO, LRU, Optimal', 'Thrashing'],
    subtopics: ['Paging', 'Page Tables & TLB', 'Segmentation', 'Virtual Memory', 'Page Replacement Algorithms', 'Thrashing'],
    order: 14,
  },

  // ── CS CORE — COMPUTER NETWORKS ──────────────────────────────
  {
    id: 'cn-osi',
    categoryId: 'cs-core',
    name: 'OSI & TCP/IP Model',
    level: 'Beginner',
    importance: 'Critical',
    description: '7-layer OSI model, 4-layer TCP/IP model, data encapsulation.',
    keyPoints: ['OSI 7 layers: Application → Physical', 'TCP/IP 4 layers', 'Data encapsulation (message→segment→packet→frame→bits)', 'PDU at each layer', 'Role of each layer'],
    subtopics: ['OSI 7 Layers', 'TCP/IP Model', 'Data Encapsulation', 'Layer Functions'],
    order: 15,
  },
  {
    id: 'cn-tcp-udp',
    categoryId: 'cs-core',
    name: 'TCP vs UDP',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Connection-oriented TCP vs connectionless UDP, 3-way handshake, use cases.',
    keyPoints: ['TCP: reliable, ordered, flow/congestion control', 'UDP: fast, unreliable, low overhead', 'TCP 3-way handshake (SYN → SYN-ACK → ACK)', 'TCP 4-way close', 'When to use UDP (streaming, DNS, gaming)'],
    subtopics: ['TCP Features', 'UDP Features', '3-Way Handshake', 'Flow Control', 'Congestion Control', 'TCP vs UDP Use Cases'],
    order: 16,
  },
  {
    id: 'cn-http',
    categoryId: 'cs-core',
    name: 'HTTP/HTTPS & REST',
    level: 'Intermediate',
    importance: 'High',
    description: 'HTTP methods, status codes, HTTPS/TLS, REST API design.',
    keyPoints: ['HTTP methods: GET, POST, PUT, DELETE, PATCH', 'Status codes: 2xx, 3xx, 4xx, 5xx', 'HTTP vs HTTPS (TLS/SSL)', 'REST principles: stateless, uniform interface', 'Cookies, sessions, JWT'],
    subtopics: ['HTTP Methods', 'Status Codes', 'HTTPS & TLS', 'REST Architecture', 'Cookies & Sessions', 'API Design'],
    order: 17,
  },
  {
    id: 'cn-dns-ip',
    categoryId: 'cs-core',
    name: 'DNS, IP & Routing',
    level: 'Intermediate',
    importance: 'Medium',
    description: 'DNS resolution, IP addressing (IPv4/v6), subnetting, routing protocols.',
    keyPoints: ['DNS hierarchy: Root → TLD → Authoritative', 'IPv4 vs IPv6', 'Subnetting & CIDR notation', 'Routing: OSPF, BGP', 'NAT (Network Address Translation)', 'ARP protocol'],
    subtopics: ['DNS Resolution', 'IPv4 & IPv6', 'Subnetting & CIDR', 'Routing Protocols', 'NAT & ARP'],
    order: 18,
  },

  // ── CS CORE — OOP ────────────────────────────────────────────
  {
    id: 'oop-basics',
    categoryId: 'cs-core',
    name: 'OOP Fundamentals',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Classes, objects, encapsulation, abstraction, inheritance, polymorphism.',
    keyPoints: ['Class vs Object', 'Encapsulation (access modifiers)', 'Abstraction (interfaces/abstract class)', 'Inheritance & method overriding', 'Polymorphism: compile-time vs runtime', 'IS-A vs HAS-A relationship'],
    subtopics: ['Classes & Objects', 'Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism', 'Interfaces vs Abstract Classes'],
    order: 19,
  },
  {
    id: 'oop-solid',
    categoryId: 'cs-core',
    name: 'SOLID Principles',
    level: 'Intermediate',
    importance: 'High',
    description: 'SRP, OCP, LSP, ISP, DIP — the five principles of clean OOP design.',
    keyPoints: ['SRP: one class, one reason to change', 'OCP: open for extension, closed for modification', 'LSP: subclass must be substitutable for parent', 'ISP: prefer small specific interfaces', 'DIP: depend on abstractions, not concretions'],
    subtopics: ['Single Responsibility', 'Open/Closed Principle', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'],
    order: 20,
  },
  {
    id: 'oop-design-patterns',
    categoryId: 'cs-core',
    name: 'Design Patterns',
    level: 'Intermediate',
    importance: 'High',
    description: 'Creational, structural, behavioural patterns: Singleton, Factory, Observer, Strategy.',
    keyPoints: ['Creational: Singleton, Factory, Builder, Prototype', 'Structural: Adapter, Decorator, Facade, Proxy', 'Behavioural: Observer, Strategy, Command, Iterator', 'When to apply patterns'],
    subtopics: ['Singleton', 'Factory & Abstract Factory', 'Builder', 'Observer', 'Strategy', 'Decorator', 'Adapter', 'Facade'],
    order: 21,
  },

  // ── SQL ──────────────────────────────────────────────────────
  {
    id: 'sql-select',
    categoryId: 'sql',
    name: 'SELECT & Filtering',
    level: 'Beginner',
    importance: 'Critical',
    description: 'SELECT, DISTINCT, WHERE, BETWEEN, IN, LIKE, IS NULL.',
    keyPoints: ['SELECT all columns with *', 'DISTINCT to remove duplicates', 'WHERE with AND/OR/NOT', 'BETWEEN for range', 'IN for list', 'LIKE with % and _ wildcards', 'IS NULL vs = NULL'],
    subtopics: ['SELECT Basics', 'DISTINCT', 'WHERE Conditions', 'BETWEEN & IN', 'LIKE & Pattern Matching', 'NULL Handling'],
    order: 1,
  },
  {
    id: 'sql-joins',
    categoryId: 'sql',
    name: 'Joins',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF joins with real examples.',
    keyPoints: ['INNER JOIN: only matching rows', 'LEFT JOIN: all left + matching right', 'RIGHT JOIN: all right + matching left', 'FULL OUTER JOIN: all rows from both', 'SELF JOIN: table joins itself', 'Joining on multiple columns'],
    subtopics: ['INNER JOIN', 'LEFT & RIGHT JOIN', 'FULL OUTER JOIN', 'SELF JOIN', 'Multiple Table Joins'],
    order: 2,
  },
  {
    id: 'sql-aggregates',
    categoryId: 'sql',
    name: 'Aggregates & GROUP BY',
    level: 'Beginner',
    importance: 'Critical',
    description: 'COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING.',
    keyPoints: ['COUNT(*) vs COUNT(column)', 'SUM, AVG for numeric columns', 'GROUP BY groups rows', 'HAVING filters groups (after GROUP BY)', 'WHERE vs HAVING', 'Aggregate with NULL values'],
    subtopics: ['COUNT, SUM, AVG', 'MIN & MAX', 'GROUP BY', 'HAVING Clause', 'WHERE vs HAVING'],
    order: 3,
  },
  {
    id: 'sql-subqueries',
    categoryId: 'sql',
    name: 'Subqueries',
    level: 'Intermediate',
    importance: 'High',
    description: 'Correlated subqueries, EXISTS, IN with subquery, scalar subqueries.',
    keyPoints: ['Scalar subquery returns single value', 'Correlated subquery references outer query', 'EXISTS checks existence', 'IN with subquery', 'NOT EXISTS pattern', 'Subquery in SELECT clause'],
    subtopics: ['Scalar Subquery', 'Correlated Subquery', 'EXISTS & NOT EXISTS', 'IN with Subquery', 'Subquery in FROM'],
    order: 4,
  },
  {
    id: 'sql-cte',
    categoryId: 'sql',
    name: 'CTEs & Recursive Queries',
    level: 'Intermediate',
    importance: 'High',
    description: 'WITH clause, Common Table Expressions, recursive CTEs for hierarchical data.',
    keyPoints: ['CTE syntax: WITH name AS (...)', 'Multiple CTEs', 'CTE vs subquery (readability)', 'Recursive CTE for hierarchy (org chart, categories)', 'Anchor + recursive member'],
    subtopics: ['CTE Basics', 'Multiple CTEs', 'Recursive CTE', 'Hierarchical Data'],
    order: 5,
  },
  {
    id: 'sql-window',
    categoryId: 'sql',
    name: 'Window Functions',
    level: 'Advanced',
    importance: 'High',
    description: 'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, PARTITION BY, ORDER BY.',
    keyPoints: ['OVER() clause defines the window', 'PARTITION BY: grouping without collapsing', 'ORDER BY inside window', 'ROW_NUMBER vs RANK vs DENSE_RANK', 'LAG & LEAD for row comparison', 'Running total with SUM OVER'],
    subtopics: ['OVER Clause', 'PARTITION BY', 'ROW_NUMBER', 'RANK & DENSE_RANK', 'LAG & LEAD', 'Running Totals'],
    order: 6,
  },
  {
    id: 'sql-interview-problems',
    categoryId: 'sql',
    name: 'SQL Interview Problems',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'Nth highest salary, duplicate detection, self-join problems, gaps & islands.',
    keyPoints: ['2nd highest salary (DENSE_RANK or subquery)', 'Find duplicates (GROUP BY + HAVING COUNT > 1)', 'Delete duplicates (CTE + ROW_NUMBER)', 'Gaps and islands problem', 'Consecutive dates/rows', 'Cumulative sum'],
    subtopics: ['Nth Highest Salary', 'Duplicate Detection', 'Running Totals', 'Gaps & Islands', 'Consecutive Records', 'Complex Joins Problems'],
    order: 7,
  },

  // ── SYSTEM DESIGN ─────────────────────────────────────────────
  {
    id: 'sd-fundamentals',
    categoryId: 'system-design',
    name: 'System Design Fundamentals',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Client-server, HTTP, REST, databases, caching, load balancing, CDN.',
    keyPoints: ['Client-server architecture', 'REST API principles', 'SQL vs NoSQL trade-offs', 'Caching strategies (LRU, CDN)', 'Load balancer types (Round-Robin, Consistent Hashing)', 'CDN for static assets'],
    subtopics: ['Client-Server Model', 'REST vs GraphQL', 'SQL vs NoSQL', 'Caching (Redis/Memcached)', 'Load Balancing', 'CDN'],
    order: 1,
  },
  {
    id: 'sd-scalability',
    categoryId: 'system-design',
    name: 'Scalability Concepts',
    level: 'Intermediate',
    importance: 'Critical',
    description: 'Horizontal vs vertical scaling, sharding, replication, CAP theorem.',
    keyPoints: ['Horizontal (scale out) vs Vertical (scale up)', 'Database replication (Master-Slave)', 'Database sharding strategies', 'CAP Theorem: Consistency, Availability, Partition Tolerance', 'Eventual consistency'],
    subtopics: ['Horizontal vs Vertical Scaling', 'Replication', 'Sharding', 'CAP Theorem', 'Consistency Models', 'Partition Tolerance'],
    order: 2,
  },
  {
    id: 'sd-lld',
    categoryId: 'system-design',
    name: 'Low Level Design (LLD)',
    level: 'Intermediate',
    importance: 'High',
    description: 'SOLID, design patterns, class diagrams, common LLD interview problems.',
    keyPoints: ['SOLID principles in design', 'Class diagram (UML basics)', 'Common patterns: Singleton, Factory, Observer, Strategy', 'State machine design', 'Thread-safe implementations'],
    subtopics: ['SOLID in LLD', 'UML Basics', 'Common Design Patterns', 'State Machine', 'Thread Safety in Design'],
    order: 3,
  },
  {
    id: 'sd-hld',
    categoryId: 'system-design',
    name: 'High Level Design (HLD)',
    level: 'Advanced',
    importance: 'High',
    description: 'Requirements, scalability, architecture diagrams, service decomposition.',
    keyPoints: ['Functional vs non-functional requirements', 'Architecture diagram walkthrough', 'Service decomposition (microservices)', 'Data flow design', 'Reliability & fault tolerance'],
    subtopics: ['Requirements Analysis', 'Architecture Diagrams', 'Microservices vs Monolith', 'Data Flow', 'Reliability Patterns'],
    order: 4,
  },
  {
    id: 'sd-practice',
    categoryId: 'system-design',
    name: 'Practice System Designs',
    level: 'Advanced',
    importance: 'High',
    description: 'URL Shortener, Chat App, Food Delivery, E-commerce, Social Feed.',
    keyPoints: ['URL Shortener (Base62, Redis cache)', 'Chat app (WebSockets, message queues)', 'Food delivery (geo hashing, location tracking)', 'Social feed (fan-out strategies)', 'Rate limiter design'],
    subtopics: ['URL Shortener', 'Chat Application', 'Food Delivery System', 'E-commerce Platform', 'Ride Sharing App', 'Social Media Feed', 'Notification System', 'File Storage (S3-like)'],
    order: 5,
  },

  // ── APTITUDE ─────────────────────────────────────────────────
  {
    id: 'apt-quantitative',
    categoryId: 'aptitude',
    name: 'Quantitative Aptitude',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Percentages, profit-loss, ratio, average, time-speed-distance, probability.',
    keyPoints: ['Percentage calculation shortcuts', 'Profit, loss, discount formulas', 'Ratio & proportion', 'Average & weighted average', 'Time, Speed, Distance (relative speed)', 'Probability basics'],
    subtopics: ['Percentages', 'Profit & Loss', 'Ratio & Proportion', 'Average', 'Time, Speed & Distance', 'Time & Work', 'Simple & Compound Interest', 'Probability', 'Permutation & Combination', 'Number Systems', 'Data Interpretation'],
    order: 1,
  },
  {
    id: 'apt-logical',
    categoryId: 'aptitude',
    name: 'Logical Reasoning',
    level: 'Beginner',
    importance: 'Critical',
    description: 'Number series, coding-decoding, blood relations, direction sense, puzzles.',
    keyPoints: ['Pattern recognition in series', 'Coding-decoding rules', 'Blood relation trees', 'Direction & distance problems', 'Seating arrangement logic', 'Syllogism validation'],
    subtopics: ['Number & Letter Series', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Seating Arrangement', 'Puzzles', 'Syllogisms', 'Statements & Conclusions'],
    order: 2,
  },
  {
    id: 'apt-verbal',
    categoryId: 'aptitude',
    name: 'Verbal Ability',
    level: 'Beginner',
    importance: 'Medium',
    description: 'Grammar, vocabulary, reading comprehension, sentence correction, para jumbles.',
    keyPoints: ['Subject-verb agreement', 'Active vs passive voice', 'Vocabulary (synonyms/antonyms)', 'Reading comprehension strategy', 'Sentence correction (common errors)', 'Para jumbles (topic sentence first)'],
    subtopics: ['Grammar Basics', 'Vocabulary (Synonyms & Antonyms)', 'Reading Comprehension', 'Sentence Correction', 'Para Jumbles', 'Fill in the Blanks'],
    order: 3,
  },
];

// ─────────────────────────────────────────────────────────────────
// QUESTIONS — Central shared pool
// ─────────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  // ── DSA Questions ──
  {
    id: 'q-two-sum',
    title: 'Two Sum',
    description: 'Given an array of integers nums and a target, return indices of two numbers that add up to target.',
    type: 'coding',
    difficulty: 'Easy',
    topicIds: ['dsa-arrays', 'dsa-hashing'],
    categoryId: 'dsa',
    options: undefined,
    correctOption: undefined,
    solutionHint: 'Use a hash map: for each element x, check if (target - x) exists in the map. Time: O(n), Space: O(n).',
    explanation: 'Store each element in a hash map as you traverse. For each new element, check if its complement (target - current) already exists.',
    tags: ['arrays', 'hash-map', 'two-pointers'],
    source: 'LeetCode #1',
    year: '2025',
    verified: true,
    frequencyCount: 85,
  },
  {
    id: 'q-kadane',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    description: 'Find the contiguous subarray which has the largest sum and return its sum.',
    type: 'coding',
    difficulty: 'Medium',
    topicIds: ['dsa-arrays', 'dsa-dp'],
    categoryId: 'dsa',
    solutionHint: 'Track current sum and reset to 0 when negative. Max of all current sums = answer. O(n) time.',
    explanation: 'At each index, decide whether to extend the previous subarray or start fresh. Kadane\'s is a special case of 1D DP.',
    tags: ['arrays', 'dp', 'greedy'],
    source: 'LeetCode #53',
    verified: true,
    frequencyCount: 62,
  },
  {
    id: 'q-binary-search',
    title: 'Binary Search',
    description: 'Given a sorted array, find the target element and return its index. Return -1 if not found.',
    type: 'coding',
    difficulty: 'Easy',
    topicIds: ['dsa-binary-search'],
    categoryId: 'dsa',
    solutionHint: 'Maintain low and high pointers. mid = low + (high - low) / 2. Compare nums[mid] with target.',
    explanation: 'Classic binary search. Key: avoid integer overflow with mid = low + (high - low) / 2 instead of (low + high) / 2.',
    tags: ['binary-search', 'arrays'],
    source: 'LeetCode #704',
    verified: true,
    frequencyCount: 45,
  },
  {
    id: 'q-word-ladder',
    title: 'Word Ladder (Shortest Transformation)',
    description: 'Given start and end words and a dictionary, find the shortest transformation sequence length.',
    type: 'coding',
    difficulty: 'Hard',
    topicIds: ['dsa-graphs', 'dsa-queue'],
    categoryId: 'dsa',
    solutionHint: 'BFS from start. For each word, try all single-character mutations. If mutation is in dictionary, add to queue.',
    explanation: 'Model as a graph: words are nodes, edges between words differing by one character. BFS gives shortest path.',
    tags: ['bfs', 'graphs', 'strings'],
    source: 'LeetCode #127 / Microsoft OA',
    year: '2025',
    verified: true,
    frequencyCount: 28,
  },
  {
    id: 'q-lcs',
    title: 'Longest Common Subsequence',
    description: 'Given two strings, find the length of their longest common subsequence.',
    type: 'coding',
    difficulty: 'Medium',
    topicIds: ['dsa-dp', 'dsa-strings'],
    categoryId: 'dsa',
    solutionHint: 'DP: dp[i][j] = LCS of s1[0..i-1] and s2[0..j-1]. If chars match: dp[i][j] = 1 + dp[i-1][j-1]. Else: max(dp[i-1][j], dp[i][j-1]).',
    explanation: 'Classic 2D DP. Build an (m+1) x (n+1) table. Fill row by row. The answer is dp[m][n].',
    tags: ['dp', 'strings'],
    source: 'LeetCode #1143',
    verified: true,
    frequencyCount: 41,
  },
  {
    id: 'q-topological-sort',
    title: 'Course Schedule (Topological Sort)',
    description: 'Given numCourses and prerequisites pairs, determine if all courses can be finished.',
    type: 'coding',
    difficulty: 'Medium',
    topicIds: ['dsa-graphs'],
    categoryId: 'dsa',
    solutionHint: 'Build adjacency list + in-degree array. Use Kahn\'s BFS: start with all nodes with in-degree 0. If processed count = numCourses, no cycle.',
    explanation: 'Cycle detection in directed graph = cannot finish all courses. Use Kahn\'s Algorithm or DFS cycle detection.',
    tags: ['graphs', 'topological-sort', 'bfs', 'cycle-detection'],
    source: 'LeetCode #207',
    verified: true,
    frequencyCount: 38,
  },

  // ── OS Questions ──
  {
    id: 'q-deadlock-conditions',
    title: 'What is a deadlock? State its 4 necessary conditions.',
    description: 'Explain the concept of deadlock in operating systems and enumerate all four Coffman conditions.',
    type: 'theory',
    difficulty: 'Medium',
    topicIds: ['os-deadlocks'],
    categoryId: 'cs-core',
    options: ['Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait', 'Race Condition, Starvation, Livelock, Deadlock', 'Atomicity, Consistency, Isolation, Durability', 'Fork, Join, Barrier, Mutex'],
    correctOption: 0,
    solutionHint: 'Remember MHNCW: Mutual exclusion, Hold-and-wait, No-preemption, Circular-wait. ALL four must hold simultaneously.',
    explanation: 'Deadlock occurs when processes are blocked indefinitely waiting for resources held by each other. All 4 Coffman conditions must hold simultaneously. Breaking any one prevents deadlock.',
    tags: ['os', 'deadlock', 'coffman'],
    source: 'Standard OS theory / TCS NQT / Infosys DSE',
    verified: true,
    frequencyCount: 95,
  },
  {
    id: 'q-process-vs-thread',
    title: 'What is the difference between a Process and a Thread?',
    description: 'Compare processes and threads in terms of memory, resource sharing, and overhead.',
    type: 'theory',
    difficulty: 'Easy',
    topicIds: ['os-processes'],
    categoryId: 'cs-core',
    options: [
      'Process has its own memory space; Thread shares memory within a process',
      'Thread has its own memory space; Process shares memory with all processes',
      'Both have the same memory space',
      'Process is faster; Thread is slower',
    ],
    correctOption: 0,
    solutionHint: 'Key difference: Memory isolation. Process = independent memory space. Thread = shared memory within process (code, data, heap, but separate stack & registers).',
    explanation: 'A process is an executing program with its own address space, code, data, heap, and stack. A thread is the smallest execution unit within a process — threads share the code, data, and heap sections but have their own stack and registers.',
    tags: ['os', 'process', 'thread', 'memory'],
    source: 'Standard OS theory / Amazon LP / Microsoft Round 2',
    verified: true,
    frequencyCount: 88,
  },
  {
    id: 'q-semaphore-vs-mutex',
    title: 'What is the difference between a Semaphore and a Mutex?',
    description: 'Explain mutex and semaphore, when each is used, and key differences.',
    type: 'theory',
    difficulty: 'Medium',
    topicIds: ['os-synchronization'],
    categoryId: 'cs-core',
    solutionHint: 'Mutex = ownership-based lock (only the locker can unlock). Semaphore = signaling mechanism (counter, N threads can pass). Binary semaphore ≠ mutex because no ownership.',
    explanation: 'Mutex: used for mutual exclusion. Only the thread that locked it can unlock it. Semaphore: a counter-based signal. Useful for controlling access to a resource pool of size N.',
    tags: ['os', 'synchronization', 'mutex', 'semaphore'],
    source: 'Standard OS / Google / Amazon / Morgan Stanley',
    verified: true,
    frequencyCount: 72,
  },
  {
    id: 'q-page-replacement',
    title: 'Compare FIFO, LRU, and Optimal Page Replacement Algorithms',
    description: 'Given a reference string and frame count, calculate page faults using FIFO, LRU, and Optimal algorithms.',
    type: 'mcq',
    difficulty: 'Medium',
    topicIds: ['os-memory'],
    categoryId: 'cs-core',
    options: ['Optimal < LRU ≤ FIFO page faults', 'FIFO < LRU ≤ Optimal page faults', 'LRU < FIFO < Optimal page faults', 'All algorithms give same page faults'],
    correctOption: 0,
    solutionHint: 'Optimal gives minimum page faults (theoretical). LRU approximates optimal. FIFO can suffer Belady\'s anomaly (more frames → more faults).',
    explanation: 'Optimal page replacement replaces the page that will be used furthest in the future. It gives minimum possible page faults but requires future knowledge. LRU is the best practical approximation.',
    tags: ['os', 'memory-management', 'paging', 'page-replacement'],
    source: 'Standard OS / GATE / Infosys DSE',
    verified: true,
    frequencyCount: 55,
  },

  // ── DBMS Questions ──
  {
    id: 'q-acid',
    title: 'What are ACID Properties? Explain with examples.',
    description: 'Define and explain all four ACID properties of database transactions.',
    type: 'theory',
    difficulty: 'Easy',
    topicIds: ['dbms-transactions'],
    categoryId: 'cs-core',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Availability, Consistency, Isolation, Durability',
      'Atomicity, Concurrency, Integrity, Durability',
      'Authentication, Consistency, Isolation, Distribution',
    ],
    correctOption: 0,
    solutionHint: 'A=Atomicity (all or nothing), C=Consistency (valid state), I=Isolation (concurrent transactions appear serial), D=Durability (committed data survives failures).',
    explanation: 'ACID guarantees database correctness. Atomicity: transaction is indivisible. Consistency: moves DB from valid to valid state. Isolation: concurrent transactions don\'t interfere. Durability: committed data is permanent even after crash.',
    tags: ['dbms', 'transactions', 'acid'],
    source: 'Standard DBMS / TCS Digital / Infosys / Amazon',
    verified: true,
    frequencyCount: 102,
  },
  {
    id: 'q-normalization',
    title: 'What is Normalization? Explain 1NF, 2NF, 3NF and BCNF.',
    description: 'Explain database normalization forms with examples and functional dependencies.',
    type: 'theory',
    difficulty: 'Medium',
    topicIds: ['dbms-normalization'],
    categoryId: 'cs-core',
    solutionHint: '1NF: atomic values, no repeating groups. 2NF: 1NF + no partial dependency (non-key attr depends on entire PK). 3NF: 2NF + no transitive dependency. BCNF: every determinant must be a candidate key.',
    explanation: 'Normalization eliminates data redundancy and update anomalies. Each normal form builds on the previous. 3NF is usually sufficient for most applications; BCNF is stricter.',
    tags: ['dbms', 'normalization', 'normal-forms'],
    source: 'Standard DBMS / TCS Digital / Goldman Sachs / Microsoft',
    verified: true,
    frequencyCount: 78,
  },
  {
    id: 'q-where-vs-having',
    title: 'What is the difference between WHERE and HAVING in SQL?',
    description: 'Compare WHERE and HAVING clauses in SQL queries.',
    type: 'mcq',
    difficulty: 'Easy',
    topicIds: ['dbms-sql-basics', 'sql-aggregates'],
    categoryId: 'cs-core',
    options: [
      'WHERE filters rows before aggregation; HAVING filters groups after GROUP BY',
      'HAVING filters rows before aggregation; WHERE filters groups after GROUP BY',
      'WHERE and HAVING are interchangeable',
      'WHERE filters columns; HAVING filters rows',
    ],
    correctOption: 0,
    solutionHint: 'WHERE operates on individual rows before any grouping. HAVING operates on aggregated groups after GROUP BY.',
    explanation: 'WHERE is applied before GROUP BY to filter individual rows. HAVING is applied after GROUP BY to filter aggregated groups. You can use aggregate functions in HAVING but not in WHERE.',
    tags: ['sql', 'where', 'having', 'group-by'],
    source: 'Standard SQL / TCS NQT / Wipro / Accenture',
    verified: true,
    frequencyCount: 90,
  },
  {
    id: 'q-second-highest-salary',
    title: 'Find the 2nd Highest Salary from Employee Table',
    description: 'Write a SQL query to find the second highest distinct salary from an Employee table.',
    type: 'sql',
    difficulty: 'Easy',
    topicIds: ['sql-interview-problems', 'sql-subqueries', 'sql-window'],
    categoryId: 'sql',
    solutionHint: 'Method 1: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee). Method 2: SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM Employee) WHERE rnk = 2.',
    explanation: 'Classic SQL interview problem. Use correlated subquery or window function DENSE_RANK(). DENSE_RANK is preferred as it generalizes to Nth highest easily.',
    tags: ['sql', 'subquery', 'dense-rank', 'window-functions'],
    source: 'TCS Digital / Infosys SP / Wipro / LeetCode #176',
    year: '2025',
    verified: true,
    frequencyCount: 115,
  },
  {
    id: 'q-delete-duplicates-sql',
    title: 'Delete Duplicate Rows Keeping Only One',
    description: 'Write a SQL query to delete duplicate rows from a table, keeping only the row with the minimum ID.',
    type: 'sql',
    difficulty: 'Medium',
    topicIds: ['sql-interview-problems', 'sql-cte'],
    categoryId: 'sql',
    solutionHint: 'Use CTE with ROW_NUMBER() OVER (PARTITION BY duplicate_col ORDER BY id). Then DELETE WHERE rn > 1.',
    explanation: 'Classic duplicate deletion pattern: WITH cte AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn FROM Person) DELETE FROM cte WHERE rn > 1;',
    tags: ['sql', 'duplicates', 'cte', 'row-number'],
    source: 'LeetCode #196 / TCS / Accenture / Cognizant',
    verified: true,
    frequencyCount: 68,
  },

  // ── CN Questions ──
  {
    id: 'q-tcp-vs-udp',
    title: 'What is the difference between TCP and UDP?',
    description: 'Compare TCP and UDP protocols across reliability, speed, and use cases.',
    type: 'mcq',
    difficulty: 'Easy',
    topicIds: ['cn-tcp-udp'],
    categoryId: 'cs-core',
    options: [
      'TCP is connection-oriented and reliable; UDP is connectionless and fast',
      'UDP is connection-oriented; TCP is connectionless',
      'TCP is faster than UDP',
      'Both TCP and UDP guarantee delivery',
    ],
    correctOption: 0,
    solutionHint: 'TCP: 3-way handshake, ACKs, ordered delivery, flow control. UDP: no connection, no ACK, low overhead. Use TCP for correctness (HTTP, FTP), UDP for speed (streaming, DNS, gaming).',
    explanation: 'TCP guarantees reliable, ordered delivery with error checking. UDP just sends packets without guarantees. UDP is faster with less overhead, suitable for real-time applications where occasional loss is acceptable.',
    tags: ['networks', 'tcp', 'udp', 'protocols'],
    source: 'Standard CN / TCS / Infosys / Microsoft / Google',
    verified: true,
    frequencyCount: 88,
  },
  {
    id: 'q-what-happens-google',
    title: 'What happens when you type www.google.com in your browser?',
    description: 'Walk through the complete network sequence from URL entry to page display.',
    type: 'theory',
    difficulty: 'Medium',
    topicIds: ['cn-dns-ip', 'cn-tcp-udp', 'cn-http'],
    categoryId: 'cs-core',
    solutionHint: '1. DNS lookup (browser cache → OS cache → resolver → root → TLD → authoritative NS). 2. TCP 3-way handshake to server IP. 3. TLS handshake (HTTPS). 4. HTTP GET request. 5. Server processes → sends HTML. 6. Browser renders DOM.',
    explanation: 'This is a comprehensive network question covering DNS, TCP, TLS, HTTP. Key steps: DNS resolution, TCP connection, TLS negotiation, HTTP request/response, browser rendering. Google interviewers love this question.',
    tags: ['networks', 'dns', 'http', 'tcp', 'browser'],
    source: 'Google Technical Interview / Amazon / Microsoft',
    year: '2025',
    verified: true,
    frequencyCount: 45,
  },

  // ── OOP Questions ──
  {
    id: 'q-abstract-vs-interface',
    title: 'What is the difference between Abstract Class and Interface?',
    description: 'Compare abstract classes and interfaces in Java/C++ with examples.',
    type: 'mcq',
    difficulty: 'Easy',
    topicIds: ['oop-basics'],
    categoryId: 'cs-core',
    options: [
      'Abstract class can have implemented methods & state; Interface only has method contracts (until default methods in Java 8+)',
      'Interface can have implemented methods; Abstract class cannot',
      'They are exactly the same',
      'Abstract class supports multiple inheritance; Interface does not',
    ],
    correctOption: 0,
    solutionHint: 'Abstract class: can have constructors, instance variables, concrete methods. Interface: all abstract by default (pre-Java 8), supports multiple inheritance, no instance variables.',
    explanation: 'Abstract class is for IS-A relationships with shared behavior. Interface is for contracts (CAN-DO relationships). Java 8+ added default methods to interfaces. C++ uses pure virtual functions for abstract class behavior.',
    tags: ['oop', 'abstract-class', 'interface', 'java'],
    source: 'TCS / Infosys / Wipro / Accenture / Amazon',
    verified: true,
    frequencyCount: 92,
  },
  {
    id: 'q-polymorphism',
    title: 'Explain Runtime vs Compile-time Polymorphism with examples.',
    description: 'Differentiate method overloading (compile-time) from method overriding (runtime) polymorphism.',
    type: 'theory',
    difficulty: 'Easy',
    topicIds: ['oop-basics'],
    categoryId: 'cs-core',
    solutionHint: 'Compile-time (static): method overloading — same name, different parameters, resolved at compile time. Runtime (dynamic): method overriding — subclass overrides parent method, resolved via vtable at runtime.',
    explanation: 'Method overloading is compile-time polymorphism: the compiler decides which method to call based on argument types. Method overriding is runtime polymorphism: the JVM/vtable decides at runtime based on the actual object type.',
    tags: ['oop', 'polymorphism', 'overloading', 'overriding'],
    source: 'TCS NQT / Infosys / Wipro / Accenture',
    verified: true,
    frequencyCount: 75,
  },

  // ── System Design Questions ──
  {
    id: 'q-cap-theorem',
    title: 'Explain CAP Theorem in Distributed Systems.',
    description: 'What is CAP theorem? Give examples of CP, AP, and CA systems.',
    type: 'theory',
    difficulty: 'Medium',
    topicIds: ['sd-scalability', 'sd-fundamentals'],
    categoryId: 'system-design',
    solutionHint: 'CAP: Consistency (all nodes see same data), Availability (every request gets response), Partition Tolerance (system works despite network splits). In practice you choose CP (MongoDB) or AP (Cassandra) because P is mandatory in distributed systems.',
    explanation: 'CAP theorem states a distributed system can only guarantee 2 of 3: Consistency, Availability, Partition Tolerance. Network partitions are unavoidable, so real systems choose CP or AP. CA systems exist only in single-node setups.',
    tags: ['system-design', 'cap-theorem', 'distributed-systems'],
    source: 'Amazon / Goldman Sachs / Flipkart / Google',
    verified: true,
    frequencyCount: 55,
  },
  {
    id: 'q-design-url-shortener',
    title: 'Design a URL Shortener (like Bitly)',
    description: 'System design of a URL shortening service handling 100M URL creations/day.',
    type: 'system-design',
    difficulty: 'Medium',
    topicIds: ['sd-practice', 'sd-hld'],
    categoryId: 'system-design',
    solutionHint: 'Key components: (1) Base62 encoding of auto-increment ID or MD5 hash prefix. (2) Redis cache for hot URLs (80/20 rule). (3) SQL DB for persistent mapping. (4) CDN for redirect latency. (5) Load balancer. (6) Rate limiter.',
    explanation: 'Classic HLD question. Focus on: URL shortening algorithm (Base62 vs hash), DB choice (SQL for strong consistency), caching strategy (Redis with LRU), redirect flow (301 vs 302 redirect), and scalability (read-heavy workload).',
    tags: ['system-design', 'hld', 'url-shortener', 'redis', 'sql'],
    source: 'Amazon / Microsoft / Flipkart / Goldman Sachs',
    year: '2025',
    verified: true,
    frequencyCount: 42,
  },

  // ── Aptitude Questions ──
  {
    id: 'q-train-crossing',
    title: 'A 200m train at 72 km/h crosses a 300m platform. Time taken?',
    description: 'A train 200m long moving at 72 km/h crosses a platform 300m long. Find the time taken.',
    type: 'mcq',
    difficulty: 'Easy',
    topicIds: ['apt-quantitative'],
    categoryId: 'aptitude',
    options: ['25 seconds', '20 seconds', '30 seconds', '15 seconds'],
    correctOption: 0,
    solutionHint: 'Total distance = train length + platform length = 200 + 300 = 500m. Speed = 72 km/h = 72 × (5/18) = 20 m/s. Time = 500/20 = 25 seconds.',
    explanation: 'When a train crosses a platform, total distance = length of train + length of platform. Convert km/h to m/s by multiplying by 5/18.',
    tags: ['aptitude', 'time-speed-distance', 'trains'],
    source: 'TCS NQT / Wipro / Accenture / Infosys',
    verified: true,
    frequencyCount: 110,
  },
  {
    id: 'q-profit-loss',
    title: 'A product is marked 25% above cost. After a 20% discount, find the profit/loss %.',
    description: 'A shopkeeper marks up his product 25% above cost price and then gives 20% discount. What is the profit/loss percentage?',
    type: 'mcq',
    difficulty: 'Easy',
    topicIds: ['apt-quantitative'],
    categoryId: 'aptitude',
    options: ['0% (no profit, no loss)', '5% profit', '5% loss', '10% profit'],
    correctOption: 0,
    solutionHint: 'Let CP = 100. MP = 125 (25% above CP). SP = 125 × 0.80 = 100 (20% discount on MP). Profit/Loss = SP - CP = 100 - 100 = 0. No profit, no loss.',
    explanation: 'Let Cost Price = 100. Marked Price = 100 × 1.25 = 125. Selling Price = 125 × (1 - 0.20) = 125 × 0.80 = 100. Since SP = CP, there is no profit or loss.',
    tags: ['aptitude', 'profit-loss', 'discount'],
    source: 'TCS NQT / Wipro / Cognizant',
    verified: true,
    frequencyCount: 68,
  },
];

// ─────────────────────────────────────────────────────────────────
// COMPANIES — Comprehensive list (all categories)
// ─────────────────────────────────────────────────────────────────

export const COMPANIES: Company[] = [
  // ── PRODUCT GIANTS ──
  {
    id: 'google',
    name: 'Google',
    logo: '🔍',
    category: 'Product Giants',
    difficulty: 'Hard',
    color: '#4285f4',
    avgPackage: '₹35 – ₹65 LPA',
    eligibility: 'B.Tech / M.Tech CS/IT/ECE (7.5+ CGPA, No active backlogs)',
    rounds: [
      'Round 1: Online Assessment (2 Advanced Algorithm Problems, 90 min)',
      'Round 2: Technical Interview 1 (Graphs, Trees, Shortest Path)',
      'Round 3: Technical Interview 2 (Dynamic Programming, Advanced DP)',
      'Round 4: Googliness & Leadership (Behavioral, Scenario-based)',
    ],
    focusTopics: ['Graph Theory & Shortest Path', 'Advanced DP & Memoization', 'Tries & Segment Trees', 'Time & Space Complexity Analysis'],
    focusCategoryIds: ['dsa', 'system-design'],
    readiness: 65,
    pastQuestionsCount: 42,
    overview: 'Google hires for software engineering roles with a strong focus on algorithms and problem-solving. The process is rigorous — expect hard-level DSA and deep system design.',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '📦',
    category: 'Product Giants',
    difficulty: 'Hard',
    color: '#ff9900',
    avgPackage: '₹28 – ₹50 LPA',
    eligibility: 'B.Tech / BE CS/IT/ECE (6.5+ CGPA)',
    rounds: [
      'Round 1: Online Assessment (2 Coding Problems + Work Simulation + LP Survey)',
      'Round 2: Technical Interview 1 (DSA + Leadership Principles)',
      'Round 3: Technical Interview 2 (System Design + OOD)',
      'Round 4: Bar Raiser (Deep LP + High-Difficulty Coding)',
    ],
    focusTopics: ['Binary Trees & Graphs', 'Dynamic Programming', 'Amazon 16 Leadership Principles', 'System Design & OOD'],
    focusCategoryIds: ['dsa', 'system-design', 'cs-core'],
    readiness: 78,
    pastQuestionsCount: 56,
    overview: 'Amazon heavily tests Leadership Principles alongside technical skills. Every interview has behavioral components. DSA and OOD are core technical areas.',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '🪟',
    category: 'Product Giants',
    difficulty: 'Medium-Hard',
    color: '#00a4ef',
    avgPackage: '₹26 – ₹45 LPA',
    eligibility: 'B.Tech CS/IT/ECE (7.0+ CGPA)',
    rounds: [
      'Round 1: Online Coding Test (3 Questions on Codility)',
      'Round 2: Technical Interview 1 (Data Structures & Algorithms)',
      'Round 3: Technical Interview 2 (OS, DBMS, Low-Level Design)',
      'Round 4: AA / Director Round (Managerial)',
    ],
    focusTopics: ['Arrays & Strings', 'Linked Lists & Trees', 'OS Process & Thread Scheduling', 'DBMS Indexing & Transactions'],
    focusCategoryIds: ['dsa', 'cs-core'],
    readiness: 82,
    pastQuestionsCount: 38,
    overview: 'Microsoft interviews are thorough on DSA and CS fundamentals. Expect questions on OS, DBMS, and OOP concepts alongside coding. Communication and problem-solving approach matter.',
  },
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    logo: '♾️',
    category: 'Product Giants',
    difficulty: 'Hard',
    color: '#0668E1',
    avgPackage: '₹38 – ₹70 LPA',
    eligibility: 'B.Tech / M.Tech CS/IT (7.5+ CGPA)',
    rounds: [
      'Round 1: Initial Technical Screening (2 DSA Problems, 45 min)',
      'Round 2: Coding Onsite 1 (Speed & Bug-free Implementation)',
      'Round 3: Coding Onsite 2 (Graphs, DP & Recursion)',
      'Round 4: Product Architecture / System Design',
    ],
    focusTopics: ['Two Pointers & Sliding Window', 'Trees & Graph Traversal', 'Speed Coding & Edge Cases', 'Scalable Feed Architecture'],
    focusCategoryIds: ['dsa', 'system-design'],
    readiness: 60,
    pastQuestionsCount: 35,
    overview: 'Meta focuses heavily on coding speed and correctness. Expect medium-to-hard LeetCode problems. Graph and tree questions are very common. System design covers their massive-scale infrastructure.',
  },
  {
    id: 'adobe',
    name: 'Adobe',
    logo: '🅰️',
    category: 'Product Giants',
    difficulty: 'Medium-Hard',
    color: '#FF0000',
    avgPackage: '₹22 – ₹40 LPA',
    eligibility: 'B.Tech CS/IT/ECE (7.0+ CGPA)',
    rounds: [
      'Round 1: Online Test (Aptitude + CS Fundamentals + Coding)',
      'Round 2: Technical Interview 1 (DSA & C++ Memory Management)',
      'Round 3: Technical Interview 2 (OS, DBMS, Mathematical Algorithms)',
      'Round 4: HR & Cultural Fit',
    ],
    focusTopics: ['C++ Pointers & Memory Management', 'Matrix Algorithms', 'DBMS Joins & Triggers', 'Graph & Tree Problems'],
    focusCategoryIds: ['dsa', 'cs-core'],
    readiness: 75,
    pastQuestionsCount: 29,
    overview: 'Adobe tests strong C++/Java fundamentals and data structures. Expect matrix and image processing related coding problems. CS theory (OS, DBMS) is tested in Round 2.',
  },

  // ── INDIAN UNICORNS ──
  {
    id: 'flipkart',
    name: 'Flipkart',
    logo: '🛒',
    category: 'Indian Unicorns',
    difficulty: 'Hard',
    color: '#2874f0',
    avgPackage: '₹22 – ₹36 LPA',
    eligibility: 'B.Tech CS/IT/ECE (7.0+ CGPA)',
    rounds: [
      'Round 1: Machine Coding Round (Build working app in 90 min)',
      'Round 2: Problem Solving / DSA Interview',
      'Round 3: System Design & LLD',
      'Round 4: HM & HR Round',
    ],
    focusTopics: ['Machine Coding (LLD)', 'Object-Oriented Design', 'Graph & DP', 'Clean Code Principles'],
    focusCategoryIds: ['dsa', 'system-design', 'cs-core'],
    readiness: 70,
    pastQuestionsCount: 31,
    overview: 'Flipkart is known for its Machine Coding Round — candidates must build a fully functional in-memory application from scratch in 90 minutes. Strong OOP and clean code skills are mandatory.',
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    logo: '🛵',
    category: 'Indian Unicorns',
    difficulty: 'Medium-Hard',
    color: '#FC8019',
    avgPackage: '₹20 – ₹34 LPA',
    eligibility: 'B.Tech CS/IT (6.5+ CGPA)',
    rounds: [
      'Round 1: Online Assessment (Coding + SQL)',
      'Round 2: Problem Solving & DSA',
      'Round 3: Low Level System Design (LLD)',
      'Round 4: Cultural Fit & Managerial',
    ],
    focusTopics: ['Geospatial Problems', 'Sliding Window', 'State Machine Pattern', 'SQL Optimizations'],
    focusCategoryIds: ['dsa', 'sql', 'system-design'],
    readiness: 76,
    pastQuestionsCount: 26,
    overview: 'Swiggy focuses on practical engineering problems related to food delivery and logistics. Expect geospatial algorithm questions, SQL, and LLD for order tracking systems.',
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    logo: '🟣',
    category: 'Indian Unicorns',
    difficulty: 'Hard',
    color: '#5f259f',
    avgPackage: '₹25 – ₹42 LPA',
    eligibility: 'B.Tech CS/IT (7.5+ CGPA)',
    rounds: [
      'Round 1: Online Test (2 Hard DSA Problems)',
      'Round 2: Machine Coding / LLD (Design Payment Gateway)',
      'Round 3: High Level System Design (HLD)',
      'Round 4: Behavioral & Executive Round',
    ],
    focusTopics: ['SOLID Principles', 'Multithreading & Concurrency', 'Distributed Locks', 'Idempotency in Payments'],
    focusCategoryIds: ['dsa', 'system-design', 'cs-core'],
    readiness: 62,
    pastQuestionsCount: 28,
    overview: 'PhonePe has a rigorous interview process focused on fintech-specific engineering. Concurrency, distributed systems, and payment idempotency are key topics.',
  },

  // ── SERVICE & CONSULTANCIES ──
  {
    id: 'tcs',
    name: 'TCS (Ninja / Digital / Prime)',
    logo: '🏢',
    category: 'Service & Consultancies',
    difficulty: 'Medium',
    color: '#10B981',
    avgPackage: '₹3.36 (Ninja) – ₹7.0 (Digital) – ₹11.5 LPA (Prime)',
    eligibility: 'B.Tech / BE / MCA / M.Sc (60% or 6.0 CGPA throughout, max 1 active backlog at registration)',
    rounds: [
      'Round 1: TCS NQT Cognitive Aptitude (Verbal, Reasoning, Numerical)',
      'Round 2: TCS NQT Advanced Coding (2 Problems in C/C++/Java/Python)',
      'Round 3: Technical Interview (OOP, DBMS, DS, Projects)',
      'Round 4: HR & Managerial Interview',
    ],
    focusTopics: ['Quantitative Aptitude & Speed Math', 'Java/C++ OOP Fundamentals', 'Basic Array/String Problems', 'SQL Queries & Joins'],
    focusCategoryIds: ['aptitude', 'cs-core', 'dsa', 'sql'],
    readiness: 91,
    pastQuestionsCount: 68,
    overview: 'TCS is the largest IT employer in India. The NQT (National Qualifier Test) is the primary filter. Focus on aptitude, basic coding, and CS fundamentals. Strong communication skills matter for HR rounds.',
  },
  {
    id: 'infosys',
    name: 'Infosys (SE / DSE / SP / PP)',
    logo: '💻',
    category: 'Service & Consultancies',
    difficulty: 'Medium-Hard',
    color: '#007cc3',
    avgPackage: '₹3.6 (SE) – ₹6.5 (DSE) – ₹9.5 LPA (SP)',
    eligibility: 'B.Tech / BE CS/IT/EC/EEE (60% throughout)',
    rounds: [
      'Round 1: HackWithInfy / InfyTQ Online Test (3 Coding Problems)',
      'Round 2: Technical Interview (Live Coding, DS, SQL)',
      'Round 3: HR & Behavioral Round',
    ],
    focusTopics: ['Dynamic Programming', 'Graph Shortest Paths', 'DBMS Normalization & SQL', 'Object-Oriented Design'],
    focusCategoryIds: ['dsa', 'cs-core', 'sql'],
    readiness: 85,
    pastQuestionsCount: 52,
    overview: 'Infosys has multiple role tiers (SE, DSE, SP, Power Programmer). Higher roles require competitive coding skills. HackWithInfy is the primary path for DSE and above.',
  },
  {
    id: 'wipro',
    name: 'Wipro (Elite / Turbo)',
    logo: '🌐',
    category: 'Service & Consultancies',
    difficulty: 'Medium',
    color: '#7f28c4',
    avgPackage: '₹3.5 – ₹6.5 LPA',
    eligibility: 'B.Tech / BE (60% in 10th, 12th & Graduation)',
    rounds: [
      'Round 1: NLTH Online Assessment (Aptitude + Essay + Coding)',
      'Round 2: Technical Interview (C/C++, Java, Basic DS, SQL)',
      'Round 3: HR Communication & Verification',
    ],
    focusTopics: ['Numerical Ability & Puzzles', 'String Pattern Matching', 'Basic OS Concepts', 'SQL SELECT & Aggregates'],
    focusCategoryIds: ['aptitude', 'cs-core', 'sql'],
    readiness: 88,
    pastQuestionsCount: 44,
    overview: 'Wipro\'s hiring process focuses on attitude and trainability alongside technical basics. The NLTH assessment is the main filter. Communication skills are highly valued.',
  },
  {
    id: 'accenture',
    name: 'Accenture (ASE / FSE)',
    logo: '⚡',
    category: 'Service & Consultancies',
    difficulty: 'Medium',
    color: '#A100FF',
    avgPackage: '₹4.5 – ₹6.5 LPA',
    eligibility: 'B.Tech / BE / MCA (65% or 6.5 CGPA, max 1 backlog at time of test)',
    rounds: [
      'Round 1: Cognitive & Technical Assessment (90 Mins)',
      'Round 2: Coding Assessment (2 Problems, 45 Mins)',
      'Round 3: AI Communication Assessment',
      'Round 4: Technical & HR Interview',
    ],
    focusTopics: ['Logical Reasoning', 'Pseudo-code Tracing', 'Basic Arrays & Strings', 'Web Fundamentals'],
    focusCategoryIds: ['aptitude', 'dsa'],
    readiness: 90,
    pastQuestionsCount: 50,
    overview: 'Accenture focuses on problem-solving ability and communication. The assessment is well-rounded including cognitive, technical, and communication sections. Attitude matters as much as skills.',
  },
  {
    id: 'cognizant',
    name: 'Cognizant (GTE / PT)',
    logo: '🔵',
    category: 'Service & Consultancies',
    difficulty: 'Medium',
    color: '#1e88e5',
    avgPackage: '₹4.0 – ₹6.0 LPA',
    eligibility: 'B.Tech / BE / MCA (60% throughout, no backlog at assessment)',
    rounds: [
      'Round 1: GenC/GenC Elevate Online Assessment (Aptitude + Coding)',
      'Round 2: Technical Interview (Java/C++, OOP, Basic DS, SQL)',
      'Round 3: HR Interview',
    ],
    focusTopics: ['Aptitude & Reasoning', 'Java / Python OOP', 'Basic Data Structures', 'SQL Fundamentals'],
    focusCategoryIds: ['aptitude', 'cs-core', 'sql'],
    readiness: 89,
    pastQuestionsCount: 38,
    overview: 'Cognizant hires in bulk through the GenC program. Strong aptitude skills are the key differentiator. Technical rounds are moderately difficult with focus on OOP and SQL.',
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    logo: '💚',
    category: 'Service & Consultancies',
    difficulty: 'Medium',
    color: '#43A047',
    avgPackage: '₹6.0 – ₹9.0 LPA',
    eligibility: 'B.Tech CS/IT/ECE (6.5+ CGPA)',
    rounds: [
      'Round 1: Online Assessment (Aptitude + Logical + Coding)',
      'Round 2: Technical Interview (DS, OOP, SQL, Project Discussion)',
      'Round 3: HR & Behavioral Interview',
    ],
    focusTopics: ['Data Structures', 'OOP Design', 'SQL', 'Problem Solving'],
    focusCategoryIds: ['dsa', 'cs-core', 'sql'],
    readiness: 80,
    pastQuestionsCount: 32,
    overview: 'Deloitte focuses on analytical and problem-solving skills alongside technical abilities. The process is moderately rigorous with emphasis on clear communication.',
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    logo: '🌊',
    category: 'Service & Consultancies',
    difficulty: 'Medium',
    color: '#0070ad',
    avgPackage: '₹3.8 – ₹5.5 LPA',
    eligibility: 'B.Tech / BE (60% throughout, No active backlogs)',
    rounds: [
      'Round 1: SuperOver Online Assessment (Aptitude + Pseudo Code + Coding)',
      'Round 2: Technical Interview',
      'Round 3: HR Interview',
    ],
    focusTopics: ['Pseudo-code Analysis', 'Aptitude', 'Basic C/Java', 'Basic SQL'],
    focusCategoryIds: ['aptitude', 'cs-core'],
    readiness: 87,
    pastQuestionsCount: 30,
    overview: 'Capgemini\'s SuperOver assessment has a unique pseudo-code analysis section. Focus on pattern recognition and basic programming concepts.',
  },

  // ── FINTECH & QUANT ──
  {
    id: 'goldman-sachs',
    name: 'Goldman Sachs',
    logo: '🏦',
    category: 'Fintech & Quant',
    difficulty: 'Hard',
    color: '#7399C6',
    avgPackage: '₹30 – ₹52 LPA',
    eligibility: 'B.Tech CS/IT/ECE/EEE (7.5+ CGPA)',
    rounds: [
      'Round 1: Online OA (Math, CS Core, 2 Coding Problems, Stats)',
      'Round 2: Technical Interview 1 (DSA & Algorithms)',
      'Round 3: Technical Interview 2 (Systems & Probability)',
      'Round 4: Culture Fit & Executive Interview',
    ],
    focusTopics: ['DP & Combinatorics', 'Probability Puzzles', 'Priority Queues & Heaps', 'OS Concurrency', 'Financial Math'],
    focusCategoryIds: ['dsa', 'cs-core', 'aptitude'],
    readiness: 64,
    pastQuestionsCount: 36,
    overview: 'Goldman Sachs combines strong technical skills with quantitative aptitude. Probability puzzles and financial math are unique to this firm. The process is highly competitive.',
  },
  {
    id: 'morgan-stanley',
    name: 'Morgan Stanley',
    logo: '🏛️',
    category: 'Fintech & Quant',
    difficulty: 'Hard',
    color: '#002B49',
    avgPackage: '₹24 – ₹38 LPA',
    eligibility: 'B.Tech CS/IT (7.0+ CGPA)',
    rounds: [
      'Round 1: Online OA (Coding + Aptitude + Core CS)',
      'Round 2: Technical Interview 1 (Trees & Multithreading)',
      'Round 3: Technical Interview 2 (DBMS & LLD)',
      'Round 4: HR & Managerial',
    ],
    focusTopics: ['Multithreading & Concurrency', 'DBMS Indexing', 'Tree Algorithms', 'C++ Smart Pointers'],
    focusCategoryIds: ['dsa', 'cs-core', 'system-design'],
    readiness: 72,
    pastQuestionsCount: 30,
    overview: 'Morgan Stanley values strong C++ knowledge, multithreading concepts, and DBMS. Technical interviews are rigorous with focus on OS and concurrency alongside standard DSA.',
  },
];

// ─────────────────────────────────────────────────────────────────
// COMPANY ↔ QUESTION MAPPINGS
// ─────────────────────────────────────────────────────────────────

export const COMPANY_QUESTIONS: CompanyQuestion[] = [
  // TCS
  { companyId: 'tcs', questionId: 'q-two-sum',            role: 'Ninja', round: 'Coding', year: '2025', frequency: 45, verified: true },
  { companyId: 'tcs', questionId: 'q-deadlock-conditions', role: 'Digital', round: 'Technical', year: '2025', frequency: 80, verified: true },
  { companyId: 'tcs', questionId: 'q-acid',                role: 'Digital', round: 'Technical', year: '2025', frequency: 70, verified: true },
  { companyId: 'tcs', questionId: 'q-where-vs-having',     role: 'Digital', round: 'Technical', year: '2024', frequency: 88, verified: true },
  { companyId: 'tcs', questionId: 'q-second-highest-salary', role: 'Digital', round: 'Technical', year: '2025', frequency: 95, verified: true },
  { companyId: 'tcs', questionId: 'q-normalization',       role: 'Digital', round: 'Technical', year: '2024', frequency: 65, verified: true },
  { companyId: 'tcs', questionId: 'q-train-crossing',      role: 'NQT', round: 'Aptitude', year: '2025', frequency: 100, verified: true },
  { companyId: 'tcs', questionId: 'q-profit-loss',         role: 'NQT', round: 'Aptitude', year: '2025', frequency: 75, verified: true },
  { companyId: 'tcs', questionId: 'q-abstract-vs-interface', role: 'Digital', round: 'Technical', year: '2025', frequency: 82, verified: true },
  { companyId: 'tcs', questionId: 'q-polymorphism',        role: 'Digital', round: 'Technical', year: '2024', frequency: 70, verified: true },
  { companyId: 'tcs', questionId: 'q-process-vs-thread',   role: 'Digital', round: 'Technical', year: '2025', frequency: 60, verified: true },
  { companyId: 'tcs', questionId: 'q-tcp-vs-udp',          role: 'Digital', round: 'Technical', year: '2024', frequency: 55, verified: true },

  // Infosys
  { companyId: 'infosys', questionId: 'q-lcs',              role: 'SP', round: 'Coding', year: '2025', frequency: 35, verified: true },
  { companyId: 'infosys', questionId: 'q-kadane',            role: 'DSE', round: 'Coding', year: '2025', frequency: 42, verified: true },
  { companyId: 'infosys', questionId: 'q-normalization',     role: 'DSE', round: 'Technical', year: '2025', frequency: 68, verified: true },
  { companyId: 'infosys', questionId: 'q-acid',              role: 'DSE', round: 'Technical', year: '2024', frequency: 72, verified: true },
  { companyId: 'infosys', questionId: 'q-abstract-vs-interface', role: 'SE', round: 'Technical', year: '2025', frequency: 78, verified: true },
  { companyId: 'infosys', questionId: 'q-second-highest-salary', role: 'DSE', round: 'Technical', year: '2025', frequency: 80, verified: true },
  { companyId: 'infosys', questionId: 'q-deadlock-conditions', role: 'SE', round: 'Technical', year: '2024', frequency: 65, verified: true },

  // Wipro
  { companyId: 'wipro', questionId: 'q-train-crossing',     role: 'Elite', round: 'Aptitude', year: '2025', frequency: 90, verified: true },
  { companyId: 'wipro', questionId: 'q-where-vs-having',    role: 'Turbo', round: 'Technical', year: '2025', frequency: 70, verified: true },
  { companyId: 'wipro', questionId: 'q-two-sum',            role: 'Turbo', round: 'Coding', year: '2025', frequency: 55, verified: true },
  { companyId: 'wipro', questionId: 'q-abstract-vs-interface', role: 'Elite', round: 'Technical', year: '2024', frequency: 68, verified: true },

  // Accenture
  { companyId: 'accenture', questionId: 'q-train-crossing', role: 'ASE', round: 'Aptitude', year: '2025', frequency: 85, verified: true },
  { companyId: 'accenture', questionId: 'q-two-sum',        role: 'ASE', round: 'Coding', year: '2025', frequency: 60, verified: true },
  { companyId: 'accenture', questionId: 'q-polymorphism',   role: 'ASE', round: 'Technical', year: '2025', frequency: 72, verified: true },
  { companyId: 'accenture', questionId: 'q-where-vs-having', role: 'ASE', round: 'Technical', year: '2024', frequency: 78, verified: true },

  // Amazon
  { companyId: 'amazon', questionId: 'q-topological-sort',  role: 'SDE-1', round: 'Coding', year: '2025', frequency: 30, verified: true },
  { companyId: 'amazon', questionId: 'q-lcs',               role: 'SDE-1', round: 'Coding', year: '2024', frequency: 25, verified: true },
  { companyId: 'amazon', questionId: 'q-design-url-shortener', role: 'SDE-2', round: 'System Design', year: '2025', frequency: 28, verified: true },
  { companyId: 'amazon', questionId: 'q-deadlock-conditions', role: 'SDE-1', round: 'Technical', year: '2025', frequency: 35, verified: true },
  { companyId: 'amazon', questionId: 'q-cap-theorem',       role: 'SDE-2', round: 'System Design', year: '2024', frequency: 30, verified: true },

  // Google
  { companyId: 'google', questionId: 'q-word-ladder',       role: 'L4', round: 'Technical', year: '2025', frequency: 20, verified: true },
  { companyId: 'google', questionId: 'q-topological-sort',  role: 'L4', round: 'Coding', year: '2024', frequency: 18, verified: true },
  { companyId: 'google', questionId: 'q-lcs',               role: 'L4', round: 'Coding', year: '2025', frequency: 15, verified: true },
  { companyId: 'google', questionId: 'q-cap-theorem',       role: 'L5', round: 'System Design', year: '2025', frequency: 22, verified: true },
  { companyId: 'google', questionId: 'q-what-happens-google', role: 'L4', round: 'Technical', year: '2024', frequency: 25, verified: true },

  // Microsoft
  { companyId: 'microsoft', questionId: 'q-word-ladder',    role: 'SDE', round: 'Coding', year: '2025', frequency: 22, verified: true },
  { companyId: 'microsoft', questionId: 'q-deadlock-conditions', role: 'SDE', round: 'Technical', year: '2025', frequency: 32, verified: true },
  { companyId: 'microsoft', questionId: 'q-semaphore-vs-mutex', role: 'SDE', round: 'Technical', year: '2024', frequency: 28, verified: true },
  { companyId: 'microsoft', questionId: 'q-normalization',  role: 'SDE', round: 'Technical', year: '2025', frequency: 25, verified: true },
  { companyId: 'microsoft', questionId: 'q-abstract-vs-interface', role: 'SDE', round: 'Technical', year: '2024', frequency: 30, verified: true },

  // Goldman Sachs
  { companyId: 'goldman-sachs', questionId: 'q-cap-theorem', role: 'Analyst', round: 'Technical', year: '2025', frequency: 18, verified: true },
  { companyId: 'goldman-sachs', questionId: 'q-semaphore-vs-mutex', role: 'Analyst', round: 'Technical', year: '2024', frequency: 20, verified: true },
  { companyId: 'goldman-sachs', questionId: 'q-page-replacement', role: 'Analyst', round: 'Technical', year: '2025', frequency: 15, verified: true },
  { companyId: 'goldman-sachs', questionId: 'q-train-crossing', role: 'Analyst', round: 'Aptitude', year: '2024', frequency: 25, verified: true },

  // Flipkart
  { companyId: 'flipkart', questionId: 'q-lcs',             role: 'SDE-1', round: 'DSA', year: '2025', frequency: 20, verified: true },
  { companyId: 'flipkart', questionId: 'q-topological-sort', role: 'SDE-1', round: 'DSA', year: '2024', frequency: 18, verified: true },
  { companyId: 'flipkart', questionId: 'q-design-url-shortener', role: 'SDE-2', round: 'System Design', year: '2025', frequency: 15, verified: true },

  // Deloitte
  { companyId: 'deloitte', questionId: 'q-acid',            role: 'Analyst', round: 'Technical', year: '2025', frequency: 45, verified: true },
  { companyId: 'deloitte', questionId: 'q-second-highest-salary', role: 'Analyst', round: 'Technical', year: '2025', frequency: 55, verified: true },
  { companyId: 'deloitte', questionId: 'q-abstract-vs-interface', role: 'Analyst', round: 'Technical', year: '2024', frequency: 48, verified: true },

  // Cognizant
  { companyId: 'cognizant', questionId: 'q-train-crossing', role: 'GTE', round: 'Aptitude', year: '2025', frequency: 88, verified: true },
  { companyId: 'cognizant', questionId: 'q-where-vs-having', role: 'GTE', round: 'Technical', year: '2025', frequency: 72, verified: true },
  { companyId: 'cognizant', questionId: 'q-polymorphism',   role: 'GTE', round: 'Technical', year: '2025', frequency: 65, verified: true },
  { companyId: 'cognizant', questionId: 'q-abstract-vs-interface', role: 'GTE', round: 'Technical', year: '2024', frequency: 70, verified: true },
];

// ─────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS — Query the content model
// ─────────────────────────────────────────────────────────────────

/** Get all questions for a given topic */
export function getQuestionsByTopic(topicId: string): Question[] {
  return QUESTIONS.filter(q => q.topicIds.includes(topicId));
}

/** Get all questions for a given category */
export function getQuestionsByCategory(categoryId: string): Question[] {
  return QUESTIONS.filter(q => q.categoryId === categoryId);
}

/** Get all company-question mappings for a given company */
export function getCompanyQuestions(companyId: string): { question: Question; mapping: CompanyQuestion }[] {
  const mappings = COMPANY_QUESTIONS.filter(cq => cq.companyId === companyId);
  return mappings
    .map(mapping => {
      const question = QUESTIONS.find(q => q.id === mapping.questionId);
      return question ? { question, mapping } : null;
    })
    .filter(Boolean) as { question: Question; mapping: CompanyQuestion }[];
}

/** Get all companies that have asked a particular question */
export function getCompaniesForQuestion(questionId: string): { company: Company; mapping: CompanyQuestion }[] {
  const mappings = COMPANY_QUESTIONS.filter(cq => cq.questionId === questionId);
  return mappings
    .map(mapping => {
      const company = COMPANIES.find(c => c.id === mapping.companyId);
      return company ? { company, mapping } : null;
    })
    .filter(Boolean) as { company: Company; mapping: CompanyQuestion }[];
}

/** Get all topics for a given category */
export function getTopicsByCategory(categoryId: string): Topic[] {
  return TOPICS.filter(t => t.categoryId === categoryId).sort((a, b) => a.order - b.order);
}

/** Get a single category by ID */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}

/** Get a single topic by ID */
export function getTopicById(id: string): Topic | undefined {
  return TOPICS.find(t => t.id === id);
}

/** Get companies filtered by category */
export function getCompaniesByCategory(category: CompanyCategory): Company[] {
  return COMPANIES.filter(c => c.category === category);
}

/** Get all companies that focus on a particular prep category */
export function getCompaniesForPrepCategory(categoryId: string): Company[] {
  return COMPANIES.filter(c => c.focusCategoryIds.includes(categoryId));
}

/** Get questions filtered by difficulty */
export function getQuestionsByDifficulty(difficulty: Difficulty): Question[] {
  return QUESTIONS.filter(q => q.difficulty === difficulty);
}

/** Get questions for a company filtered by type */
export function getCompanyQuestionsByType(companyId: string, type: QuestionType): { question: Question; mapping: CompanyQuestion }[] {
  return getCompanyQuestions(companyId).filter(({ question }) => question.type === type);
}

/** Summary stats for a category (for progress display) */
export function getCategoryStats(categoryId: string) {
  const topics = getTopicsByCategory(categoryId);
  const questions = getQuestionsByCategory(categoryId);
  return {
    topicCount: topics.length,
    questionCount: questions.length,
    beginnerTopics: topics.filter(t => t.level === 'Beginner').length,
    intermediateTopics: topics.filter(t => t.level === 'Intermediate').length,
    advancedTopics: topics.filter(t => t.level === 'Advanced').length,
  };
}
