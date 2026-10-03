'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ── TYPES ───────────────────────────────────────────────────────────────── */
export type QuestionItem = {
  id: string;
  title: string;
  category: 'Coding / DSA' | 'CS Core' | 'Aptitude & Reasoning' | 'System Design / OOD' | 'Behavioral / HR';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Medium-Hard' | 'Easy-Medium';
  year: string;
  source: string;
  frequency: string;
  topics: string[];
  description: string;
  solutionHint: string;
};

export type CompanyTrack = {
  id: string;
  name: string;
  logo: string;
  category: 'Product Giants' | 'Indian Unicorns' | 'Service & Consultancies' | 'Fintech & Quant';
  difficulty: 'Easy' | 'Medium' | 'Medium-Hard' | 'Hard';
  color: string;
  avgPackage: string;
  eligibility: string;
  rounds: string[];
  focusTopics: string[];
  readiness: number;
  pastQuestionsCount: number;
  pastQuestions: QuestionItem[];
};

/* ── COMPREHENSIVE COMPANY TRACKS DATASET (Product + Service + Fintech) ──── */
const COMPANY_TRACKS: CompanyTrack[] = [
  // ── PRODUCT GIANTS ──
  {
    id: 'google',
    name: 'Google',
    logo: '🔍',
    category: 'Product Giants',
    difficulty: 'Hard',
    color: '#4285f4',
    avgPackage: '₹35 - ₹65 LPA',
    eligibility: 'B.Tech / M.Tech CS/IT/ECE (7.5+ CGPA, No Active Backlogs)',
    rounds: [
      'Round 1: Online Assessment (2 Advanced Algorithmic Problems)',
      'Round 2: Technical Interview 1 (Graphs & Shortest Path)',
      'Round 3: Technical Interview 2 (Dynamic Programming & Trees)',
      'Round 4: Googliness & Leadership (Behavioral & Scenario-based)',
    ],
    focusTopics: ['Graph Theory & Shortest Path', 'Advanced DP & Memoization', 'Tries & Segment Trees', 'Time & Space Complexity Analysis'],
    readiness: 65,
    pastQuestionsCount: 42,
    pastQuestions: [
      {
        id: 'g-1',
        title: 'Count Subarrays With Median K',
        category: 'Coding / DSA',
        difficulty: 'Hard',
        year: '2025',
        source: 'Google OA 2025 / Kickstart',
        frequency: 'Asked 18 times',
        topics: ['Hash Map', 'Prefix Sum', 'Arrays'],
        description: 'Given an array of size n containing distinct integers from 1 to n, find the number of non-empty subarrays with median equal to k.',
        solutionHint: 'Convert elements > k to +1 and < k to -1. Find index of k, compute prefix sums before and after k, store prefix counts in a map.',
      },
      {
        id: 'g-2',
        title: 'Snapshot Array with Concurrent Reads',
        category: 'Coding / DSA',
        difficulty: 'Medium',
        year: '2024',
        source: 'LeetCode Google Tagged',
        frequency: 'Asked 24 times',
        topics: ['Binary Search', 'Design', 'Vector'],
        description: 'Implement a SnapshotArray that supports set(index, val), snap(), and get(index, snap_id) in O(log S) time complexity.',
        solutionHint: 'Store a vector of (snap_id, val) pairs for each array element. Use upper_bound binary search on snap_id during get().',
      },
      {
        id: 'g-3',
        title: 'Design Google Docs Real-time Collaborative Editor',
        category: 'System Design / OOD',
        difficulty: 'Hard',
        year: '2025',
        source: 'Google System Design Interview',
        frequency: 'Asked 14 times',
        topics: ['Operational Transformation', 'WebSockets', 'Distributed Systems'],
        description: 'Architect a concurrent document editor supporting thousands of users typing simultaneously without conflicts.',
        solutionHint: 'Use Conflict-free Replicated Data Types (CRDTs) or Operational Transformation with WebSockets & Redis pub/sub backplane.',
      },
      {
        id: 'g-4',
        title: 'Googliness: Conflict with Tech Lead on System Architecture',
        category: 'Behavioral / HR',
        difficulty: 'Medium',
        year: '2024',
        source: 'Google Googliness Round',
        frequency: 'Asked 30+ times',
        topics: ['Behavioral', 'Leadership', 'Conflict Resolution'],
        description: 'Describe a situation where your technical proposal was rejected by senior engineer. How did you handle disagreement?',
        solutionHint: 'Focus on data-driven benchmarks, trade-off analysis, empathy, and aligning with team goals over ego.',
      },
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '📦',
    category: 'Product Giants',
    difficulty: 'Hard',
    color: '#ff9900',
    avgPackage: '₹28 - ₹50 LPA',
    eligibility: 'B.Tech / BE CS/IT/ECE (6.5+ CGPA)',
    rounds: [
      'Round 1: Online Assessment (2 Coding Qs + Work Simulation + LP Survey)',
      'Round 2: Technical Interview 1 (DSA & Leadership Principles)',
      'Round 3: Technical Interview 2 (System Design & OOD)',
      'Round 4: Bar Raiser Round (Deep LP + High Difficulty Coding)',
    ],
    focusTopics: ['Binary Trees & Graphs', 'Dynamic Programming', 'Amazon 16 Leadership Principles', 'System Design & OOD'],
    readiness: 78,
    pastQuestionsCount: 56,
    pastQuestions: [
      {
        id: 'amz-1',
        title: 'Optimal Utilization / Two Sum Less Than K',
        category: 'Coding / DSA',
        difficulty: 'Medium',
        year: '2025',
        source: 'Amazon SDE OA 2025',
        frequency: 'Asked 32 times',
        topics: ['Two Pointers', 'Binary Search', 'Arrays'],
        description: 'Given two lists of pair elements (ID, value) and a target capacity, find all pair combinations whose total sum is <= capacity and maximum possible.',
        solutionHint: 'Sort both arrays by value. Use two pointers starting from left of first array and right of second array to maintain max sum <= capacity.',
      },
      {
        id: 'amz-2',
        title: 'Analyze User Website Visit Pattern',
        category: 'Coding / DSA',
        difficulty: 'Hard',
        year: '2024',
        source: 'LeetCode Amazon Tagged',
        frequency: 'Asked 28 times',
        topics: ['Hash Table', 'Sorting', 'String'],
        description: 'Given arrays of username, timestamp, and website, return the 3-sequence of websites visited by the highest number of distinct users.',
        solutionHint: 'Group visits by user, sort each user log by timestamp, generate all unique 3-subsequences for each user, then count frequencies in a global map.',
      },
      {
        id: 'amz-3',
        title: 'Design Amazon Locker System',
        category: 'System Design / OOD',
        difficulty: 'Hard',
        year: '2025',
        source: 'GeeksforGeeks Amazon Log',
        frequency: 'Asked 19 times',
        topics: ['Object-Oriented Design', 'State Pattern'],
        description: 'Design an automated parcel locker network (small, medium, large lockers) with assignment rules, OTP code redemption, and expiration handling.',
        solutionHint: 'Use Strategy pattern for locker selection, State pattern for locker allocation, and TTL cache / queue for code expiration.',
      },
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '🪟',
    category: 'Product Giants',
    difficulty: 'Medium-Hard',
    color: '#00a4ef',
    avgPackage: '₹26 - ₹45 LPA',
    eligibility: 'B.Tech CS/IT/ECE (7.0+ CGPA)',
    rounds: [
      'Round 1: Online Coding Test (3 Questions on Codility/HackerRank)',
      'Round 2: Technical Interview 1 (Data Structures & Algorithms)',
      'Round 3: Technical Interview 2 (OS, DBMS, Low-Level Design)',
      'Round 4: AA (As Appropriate) / Director Managerial Round',
    ],
    focusTopics: ['Arrays & Strings', 'Linked Lists & Trees', 'OS Process & Thread Scheduling', 'DBMS Indexing & Transactions'],
    readiness: 82,
    pastQuestionsCount: 38,
    pastQuestions: [
      {
        id: 'ms-1',
        title: 'Min Steps to Make Strings Equal / Word Ladder II',
        category: 'Coding / DSA',
        difficulty: 'Medium-Hard',
        year: '2025',
        source: 'Microsoft Codility OA',
        frequency: 'Asked 22 times',
        topics: ['BFS', 'Graph', 'Hash Set'],
        description: 'Given two words and a dictionary, return shortest transformation sequence from start to end, changing one letter at a time.',
        solutionHint: 'Bi-directional BFS from both start and end words simultaneously to minimize queue search tree.',
      },
      {
        id: 'ms-2',
        title: 'Operating System Thread Scheduling & Deadlock Avoidance',
        category: 'CS Core',
        difficulty: 'Medium',
        year: '2024',
        source: 'GeeksforGeeks MSFT Round 2',
        frequency: 'Asked 19 times',
        topics: ['OS', 'Banker\'s Algorithm', 'Process Sync'],
        description: 'Explain Banker\'s Algorithm for deadlock avoidance with 4 processes and 3 resource types. Compute safety state vector.',
        solutionHint: 'Calculate Need matrix = Max - Allocation. Iteratively find process where Need <= Available resources.',
      },
    ],
  },
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    logo: '♾️',
    category: 'Product Giants',
    difficulty: 'Hard',
    color: '#0668E1',
    avgPackage: '₹38 - ₹70 LPA',
    eligibility: 'B.Tech / M.Tech CS/IT (7.5+ CGPA)',
    rounds: [
      'Round 1: Initial Technical Screening (2 Fast DSA Problems in 45 mins)',
      'Round 2: Coding Onsite 1 (Speed & Bug-free Implementation)',
      'Round 3: Coding Onsite 2 (Graph, DP & Recursion)',
      'Round 4: Product Architecture / System Design',
    ],
    focusTopics: ['Two Pointers & Sliding Window', 'Trees & Graph Traversal', 'Speed Coding & Edge Cases', 'Scalable Feed Architecture'],
    readiness: 60,
    pastQuestionsCount: 35,
    pastQuestions: [
      {
        id: 'meta-1',
        title: 'Minimum Remove to Make Valid Parentheses',
        category: 'Coding / DSA',
        difficulty: 'Medium',
        year: '2025',
        source: 'Meta Screening Round 2025',
        frequency: 'Asked 40+ times',
        topics: ['Stack', 'String', 'Greedy'],
        description: 'Given a string of parenthesis and lowercase characters, remove minimum parentheses so string becomes valid.',
        solutionHint: 'Use a stack to keep track of unmatched indices of "(" and ")". Filter out unmatched indices in second pass.',
      },
      {
        id: 'meta-2',
        title: 'Design Meta Newsfeed Architecture',
        category: 'System Design / OOD',
        difficulty: 'Hard',
        year: '2024',
        source: 'Meta E5 System Design',
        frequency: 'Asked 25 times',
        topics: ['Fan-out on Write', 'Redis Cache', 'Timeline Aggregation'],
        description: 'Design a newsfeed system supporting 2B users where posts by followed accounts appear instantly in timeline.',
        solutionHint: 'Hybrid Fan-out model: Push model (Fan-out on write) for normal users; Pull model (Fan-out on read) for high-follower celebrity accounts.',
      },
    ],
  },
  {
    id: 'adobe',
    name: 'Adobe',
    logo: '🅰️',
    category: 'Product Giants',
    difficulty: 'Medium-Hard',
    color: '#FF0000',
    avgPackage: '₹22 - ₹40 LPA',
    eligibility: 'B.Tech CS/IT/ECE (7.0+ CGPA)',
    rounds: [
      'Round 1: Online Test (Aptitude + CS Fundamentals + Coding)',
      'Round 2: Technical Interview 1 (DSA & C++ Pointers/Memory)',
      'Round 3: Technical Interview 2 (OS, DBMS, Image Algorithms)',
      'Round 4: HR & Cultural Fit',
    ],
    focusTopics: ['C++ Pointers & Memory Management', 'Arrays & Strings', 'DBMS Joins & Triggers', 'Mathematical Geometry'],
    readiness: 75,
    pastQuestionsCount: 29,
    pastQuestions: [
      {
        id: 'ad-1',
        title: 'Matrix Image Rotation 90 Degrees In-Place',
        category: 'Coding / DSA',
        difficulty: 'Medium',
        year: '2025',
        source: 'Adobe Technical Round 1',
        frequency: 'Asked 20 times',
        topics: ['Arrays', 'Matrix Manipulation'],
        description: 'Given an N x N 2D matrix representing an image, rotate image by 90 degrees clockwise in-place.',
        solutionHint: 'First transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row horizontally.',
      },
    ],
  },

  // ── INDIAN UNICORNS ──
  {
    id: 'flipkart',
    name: 'Flipkart',
    logo: '🛒',
    category: 'Indian Unicorns',
    difficulty: 'Hard',
    color: '#2874f0',
    avgPackage: '₹22 - ₹36 LPA',
    eligibility: 'B.Tech CS/IT/ECE (7.0+ CGPA)',
    rounds: [
      'Round 1: Machine Coding Round (Design and Code fully functional app in 90 mins)',
      'Round 2: Problem Solving / DSA Interview',
      'Round 3: System Design & Low Level Design',
      'Round 4: HM & HR Round',
    ],
    focusTopics: ['Machine Coding (In-Memory DB / Ride Sharing)', 'Object-Oriented Design', 'Graph & DP', 'Clean Code Principles'],
    readiness: 70,
    pastQuestionsCount: 31,
    pastQuestions: [
      {
        id: 'fk-1',
        title: 'Machine Coding: Design Flipkart Flash Sale Booking System',
        category: 'System Design / OOD',
        difficulty: 'Hard',
        year: '2025',
        source: 'Flipkart SDE-1 Machine Coding',
        frequency: 'Asked 17 times',
        topics: ['OOD', 'Concurrency', 'In-Memory Data Store'],
        description: 'Design and implement an in-memory inventory management system for flash sales handling inventory locking, user cart limits, and payment callbacks.',
        solutionHint: 'Use Singleton for inventory manager, Synchronized/ReentrantLock for inventory deduction, and Strategy for discount rules.',
      },
      {
        id: 'fk-2',
        title: 'Cheapest Flights Within K Stops',
        category: 'Coding / DSA',
        difficulty: 'Medium-Hard',
        year: '2024',
        source: 'Flipkart DSA Round',
        frequency: 'Asked 21 times',
        topics: ['Bellman-Ford', 'Dijkstra', 'Graph'],
        description: 'Find cheapest price from src to dst with at most k stops given n cities connected by flights.',
        solutionHint: 'Use modified Bellman-Ford algorithm for K iterations or BFS with queue holding (city, price, stops).',
      },
    ],
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    logo: '🛵',
    category: 'Indian Unicorns',
    difficulty: 'Medium-Hard',
    color: '#FC8019',
    avgPackage: '₹20 - ₹34 LPA',
    eligibility: 'B.Tech CS/IT (6.5+ CGPA)',
    rounds: [
      'Round 1: Online Assessment (Coding & SQL)',
      'Round 2: Problem Solving & DSA',
      'Round 3: Low Level System Design (LLD)',
      'Round 4: Cultural Fit & Managerial',
    ],
    focusTopics: ['Geospatial Hashing (QuadTree / H3)', 'Sliding Window', 'State Machine Pattern', 'SQL Optimizations'],
    readiness: 76,
    pastQuestionsCount: 26,
    pastQuestions: [
      {
        id: 'swg-1',
        title: 'Design Food Delivery Order Tracking State Machine',
        category: 'System Design / OOD',
        difficulty: 'Medium-Hard',
        year: '2025',
        source: 'Swiggy LLD Round',
        frequency: 'Asked 15 times',
        topics: ['State Design Pattern', 'Event-Driven Architecture'],
        description: 'Design status transitions for order lifecycle: ORDERED -> PLACED -> PREPARING -> PICKED_UP -> DELIVERED.',
        solutionHint: 'Implement State Design Pattern to enforce valid state transitions and trigger push notifications on state changes.',
      },
    ],
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    logo: '🟣',
    category: 'Indian Unicorns',
    difficulty: 'Hard',
    color: '#5f259f',
    avgPackage: '₹25 - ₹42 LPA',
    eligibility: 'B.Tech CS/IT (7.5+ CGPA)',
    rounds: [
      'Round 1: Online Test (2 Hard DSA Questions)',
      'Round 2: Machine Coding / LLD (Design Payment Gateway Simulator)',
      'Round 3: High Level System Design (HLD)',
      'Round 4: Behavioral & Executive Round',
    ],
    focusTopics: ['SOLID Principles', 'Multithreading & Concurrency', 'Distributed Locks', 'Idempotency in Payments'],
    readiness: 62,
    pastQuestionsCount: 28,
    pastQuestions: [
      {
        id: 'ppe-1',
        title: 'Design Payment Gateway Aggregator (LLD)',
        category: 'System Design / OOD',
        difficulty: 'Hard',
        year: '2025',
        source: 'PhonePe SDE Machine Coding',
        frequency: 'Asked 14 times',
        topics: ['Strategy Pattern', 'Idempotency', 'Java'],
        description: 'Implement a payment routing engine that dynamically chooses payment gateways (Razorpay, Paytm) based on bank success rates.',
        solutionHint: 'Use Strategy pattern for gateway selection, Observer pattern for success rate metrics, and unique idempotency keys for retry handling.',
      },
    ],
  },

  // ── SERVICE-BASED & IT CONSULTANCIES ──
  {
    id: 'tcs',
    name: 'TCS (Digital / Prime / Ninja)',
    logo: '🏢',
    category: 'Service & Consultancies',
    difficulty: 'Medium',
    color: '#10B981',
    avgPackage: '₹3.36 (Ninja) - ₹7.0 (Digital) - ₹11.5 LPA (Prime)',
    eligibility: 'B.Tech / BE / MCA / M.Sc (60% or 6.0 CGPA throughout 10th, 12th, UG, 1 Active Backlog allowed at registration)',
    rounds: [
      'Round 1: TCS NQT Cognitive (Verbal, Reasoning, Numerical Aptitude)',
      'Round 2: TCS NQT Advanced Coding (2 Programming Tasks in C/C++/Java/Python)',
      'Round 3: Technical Interview (OOPs, DBMS, Data Structures, Project)',
      'Round 4: HR & Managerial Interview',
    ],
    focusTopics: ['Quantitative Aptitude & Time-Speed', 'C++ / Java Core OOP', 'Basic Array/String Manipulation', 'SQL Queries & Joins'],
    readiness: 91,
    pastQuestionsCount: 68,
    pastQuestions: [
      {
        id: 'tcs-1',
        title: 'Smallest Missing Positive Integer (Cyclic Sort)',
        category: 'Coding / DSA',
        difficulty: 'Medium',
        year: '2025',
        source: 'TCS NQT Prime 2025',
        frequency: 'Asked 45+ times',
        topics: ['Arrays', 'Cyclic Sort'],
        description: 'Given an unsorted integer array, find the smallest missing positive integer in O(n) time and O(1) auxiliary space.',
        solutionHint: 'Place each number x in index x-1 using cyclic swapping while 1 <= x <= n.',
      },
      {
        id: 'tcs-2',
        title: 'SQL Query: Second Highest Salary with Department Name',
        category: 'CS Core',
        difficulty: 'Easy-Medium',
        year: '2025',
        source: 'TCS Digital Technical Round',
        frequency: 'Asked 60+ times',
        topics: ['SQL', 'Joins', 'DENSE_RANK'],
        description: 'Write SQL query using subquery or DENSE_RANK window function to fetch 2nd highest salary per department.',
        solutionHint: 'SELECT dept_name, salary FROM (SELECT d.dept_name, e.salary, DENSE_RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) as rnk FROM Employee e JOIN Department d ON e.dept_id = d.id) WHERE rnk = 2;',
      },
      {
        id: 'tcs-3',
        title: 'Speed, Time, Distance & Train Crossing Problems',
        category: 'Aptitude & Reasoning',
        difficulty: 'Easy',
        year: '2024',
        source: 'TCS NQT Cognitive Section',
        frequency: 'Asked 80+ times',
        topics: ['Quantitative Aptitude', 'Relative Speed'],
        description: 'A 200m long train running at 72 km/h crosses a platform of length 300m. Calculate time taken in seconds.',
        solutionHint: 'Total distance = 200 + 300 = 500m. Speed in m/s = 72 * (5/18) = 20 m/s. Time = 500 / 20 = 25 seconds.',
      },
    ],
  },
  {
    id: 'infosys',
    name: 'Infosys (Power Programmer / SP / SE)',
    logo: '💻',
    category: 'Service & Consultancies',
    difficulty: 'Medium-Hard',
    color: '#007cc3',
    avgPackage: '₹3.6 (SE) - ₹6.5 (DSE) - ₹9.5 LPA (SP)',
    eligibility: 'B.Tech / BE CS/IT/EC/EEE (60% or 6.0 CGPA)',
    rounds: [
      'Round 1: HackWithInfy / InfyTQ Exam (3 Competitive Coding Problems)',
      'Round 2: Technical Interview (Live Coding, Data Structures, SQL)',
      'Round 3: HR & Behavioral Round',
    ],
    focusTopics: ['Dynamic Programming', 'Graph Shortest Paths', 'DBMS Indexing & Normalization', 'Object-Oriented Design'],
    readiness: 85,
    pastQuestionsCount: 52,
    pastQuestions: [
      {
        id: 'infy-1',
        title: 'Longest Palindromic Subsequence with K Edits',
        category: 'Coding / DSA',
        difficulty: 'Medium-Hard',
        year: '2025',
        source: 'Infosys SP Test 2025',
        frequency: 'Asked 18 times',
        topics: ['Dynamic Programming', 'Strings'],
        description: 'Find length of longest palindromic subsequence obtainable by replacing at most K characters.',
        solutionHint: '3D DP table dp[i][j][k] representing max length for substring s[i..j] with k remaining allowed edits.',
      },
      {
        id: 'infy-2',
        title: 'Object-Oriented Design of Parking Lot System',
        category: 'CS Core',
        difficulty: 'Medium',
        year: '2024',
        source: 'Infosys DSE Technical Round',
        frequency: 'Asked 30 times',
        topics: ['OOP', 'Java', 'Design Patterns'],
        description: 'Design classes for ParkingSpot, Vehicle (Bike, Car, Truck), Ticket, and Payment Strategy using SOLID principles.',
        solutionHint: 'Use Inheritance for Vehicles, Factory pattern for Ticket creation, and Strategy pattern for Fee calculation.',
      },
    ],
  },
  {
    id: 'wipro',
    name: 'Wipro (Elite / Turbo)',
    logo: '🌐',
    category: 'Service & Consultancies',
    difficulty: 'Medium',
    color: '#7f28c4',
    avgPackage: '₹3.5 - ₹6.5 LPA',
    eligibility: 'B.Tech / BE (60% in 10th, 12th & Graduation)',
    rounds: [
      'Round 1: NLTH Assessment (Aptitude + Essay Writing + Coding)',
      'Round 2: Technical Interview (C/C++, Java, Basic DS, SQL)',
      'Round 3: HR Communication & Verification',
    ],
    focusTopics: ['Numerical Ability & Puzzles', 'String Pattern Matching', 'Basic Operating Systems', 'SQL Select & Aggregates'],
    readiness: 88,
    pastQuestionsCount: 44,
    pastQuestions: [
      {
        id: 'wip-1',
        title: 'Count Frequency of Elements & Find Highest Frequent Word',
        category: 'Coding / DSA',
        difficulty: 'Easy-Medium',
        year: '2025',
        source: 'Wipro Turbo Assessment',
        frequency: 'Asked 35 times',
        topics: ['Strings', 'Hash Map'],
        description: 'Given a sentence, return the word that occurs most frequently. If tie, return lexicographically smallest.',
        solutionHint: 'Tokenize string into words using space delimiter, count frequencies in std::map (auto-sorted lexicographically).',
      },
    ],
  },
  {
    id: 'accenture',
    name: 'Accenture (ASE / FSE)',
    logo: '⚡',
    category: 'Service & Consultancies',
    difficulty: 'Medium',
    color: '#A100FF',
    avgPackage: '₹4.5 - ₹6.5 LPA',
    eligibility: 'B.Tech / BE / MCA (65% or 6.5 CGPA, max 1 backlog allowed at time of test)',
    rounds: [
      'Round 1: Cognitive & Technical Assessment (60 Mins, 90 Questions)',
      'Round 2: Coding Assessment (45 Mins, 2 Questions)',
      'Round 3: Communication Assessment (Automated AI Speech Test)',
      'Round 4: One-on-One Technical & HR Interview',
    ],
    focusTopics: ['Pseudo-code Output tracing', 'Logical Reasoning & Syllogisms', 'Basic Array Manipulation', 'Web Fundamentals'],
    readiness: 90,
    pastQuestionsCount: 50,
    pastQuestions: [
      {
        id: 'acc-1',
        title: 'Binary Operations String Evaluation',
        category: 'Coding / DSA',
        difficulty: 'Easy-Medium',
        year: '2025',
        source: 'Accenture Coding Assessment',
        frequency: 'Asked 50+ times',
        topics: ['Bit Manipulation', 'Strings'],
        description: 'Given a string containing binary digits and operators (A for AND, B for OR, C for XOR), compute left-to-right result.',
        solutionHint: 'Iterate from index 1 step 2, apply bitwise operation of string[i] on previous result accumulator.',
      },
    ],
  },

  // ── FINTECH & QUANT ──
  {
    id: 'goldman_sachs',
    name: 'Goldman Sachs',
    logo: '🏦',
    category: 'Fintech & Quant',
    difficulty: 'Hard',
    color: '#7399C6',
    avgPackage: '₹30 - ₹52 LPA',
    eligibility: 'B.Tech CS/IT/ECE/EEE (7.5+ CGPA)',
    rounds: [
      'Round 1: Aptitude & Coding OA (Math, CS Core, 2 Coding Qs, Advanced Stats)',
      'Round 2: Technical Interview 1 (Algorithms & Data Structures)',
      'Round 3: Technical Interview 2 (System Design & Probability)',
      'Round 4: Culture Fit & Senior Executive Interview',
    ],
    focusTopics: ['Dynamic Programming & Combinatorics', 'Probability & Statistics Puzzles', 'Priority Queues & Heaps', 'Operating Systems & Concurrency'],
    readiness: 64,
    pastQuestionsCount: 36,
    pastQuestions: [
      {
        id: 'gs-1',
        title: 'High-Frequency Order Book Matching Engine',
        category: 'Coding / DSA',
        difficulty: 'Hard',
        year: '2025',
        source: 'Goldman Sachs Quant OA',
        frequency: 'Asked 16 times',
        topics: ['Priority Queue', 'Maps', 'Data Structures'],
        description: 'Design an order matching engine that matches Buy and Sell limit orders in price-time priority.',
        solutionHint: 'Use max-heap for Buy orders (highest price first) and min-heap for Sell orders (lowest price first) backed by doubly-linked lists for O(1) order cancellation.',
      },
      {
        id: 'gs-2',
        title: 'Probability of Random Walk in 2D Grid with Obstacles',
        category: 'Aptitude & Reasoning',
        difficulty: 'Hard',
        year: '2024',
        source: 'Goldman Sachs Math Round',
        frequency: 'Asked 18 times',
        topics: ['Probability', 'Combinatorics', 'Markov Chains'],
        description: 'Calculate probability of reaching target (N, M) from (0,0) with uniform random moves (Right/Up) avoiding K specified traps.',
        solutionHint: 'Use dynamic programming or inclusion-exclusion principle with combination counts C(x+y, x).',
      },
    ],
  },
  {
    id: 'morgan_stanley',
    name: 'Morgan Stanley',
    logo: '🏛️',
    category: 'Fintech & Quant',
    difficulty: 'Hard',
    color: '#002B49',
    avgPackage: '₹24 - ₹38 LPA',
    eligibility: 'B.Tech CS/IT (7.0+ CGPA)',
    rounds: [
      'Round 1: Online Assessment (Coding + Aptitude + Core CS)',
      'Round 2: Technical Interview 1 (Trees & Multithreading)',
      'Round 3: Technical Interview 2 (DBMS Indexing & Low-Level Design)',
      'Round 4: HR & Managerial',
    ],
    focusTopics: ['Multithreading & Concurrency', 'DBMS Indexing & B+ Trees', 'Tree & Graph Algorithms', 'C++ Smart Pointers'],
    readiness: 72,
    pastQuestionsCount: 30,
    pastQuestions: [
      {
        id: 'ms-1',
        title: 'Thread-safe Bounded Blocking Queue in C++/Java',
        category: 'CS Core',
        difficulty: 'Medium-Hard',
        year: '2025',
        source: 'Morgan Stanley Tech Round',
        frequency: 'Asked 22 times',
        topics: ['Multithreading', 'Concurrency', 'OS'],
        description: 'Implement a thread-safe Queue with push(), pop(), and max capacity using mutex locks and condition variables.',
        solutionHint: 'Use std::unique_lock with condition_variable. Wait on queue full for push and queue empty for pop.',
      },
    ],
  },
];

/* ── CS CORE SUBJECTS WITH REVISION CHEAT SHEETS ────────────────────────────── */
type SubjectItem = {
  id: string;
  icon: string;
  name: string;
  code: string;
  qCount: number;
  doneCount: number;
  color: string;
  cheatSheet: {
    summary: string;
    keyConcepts: { title: string; desc: string }[];
    topQuestions: { q: string; a: string }[];
  };
};

const CS_SUBJECTS: SubjectItem[] = [
  {
    id: 'os',
    icon: '🖥',
    name: 'Operating Systems',
    code: 'CS501',
    qCount: 120,
    doneCount: 88,
    color: '#38BDF8',
    cheatSheet: {
      summary: 'Manages computer hardware, processes, memory allocation, storage, and synchronization.',
      keyConcepts: [
        { title: 'Process vs Thread', desc: 'Process is an executing program instance with its own memory space. Thread is a lightweight execution segment sharing process memory.' },
        { title: 'Deadlock Conditions (Coffman)', desc: '1. Mutual Exclusion  2. Hold and Wait  3. No Preemption  4. Circular Wait.' },
        { title: 'Virtual Memory & Paging', desc: 'Translates virtual addresses to physical frame addresses using Page Tables and TLB (Translation Lookaside Buffer).' },
        { title: 'CPU Scheduling Algorithms', desc: 'FCFS, SJF (Optimal average waiting time), Round Robin (Time Quantum), Priority Scheduling.' },
      ],
      topQuestions: [
        { q: 'What is thrashing in OS?', a: 'High paging activity where the system spends more time swapping pages in/out than executing processes.' },
        { q: 'What is a semaphore vs mutex?', a: 'Mutex is a locking mechanism (ownership by 1 thread). Semaphore is a signaling mechanism (counter allowing N threads).' },
      ],
    },
  },
  {
    id: 'dbms',
    icon: '🗃',
    name: 'DBMS & SQL',
    code: 'CS502',
    qCount: 95,
    doneCount: 74,
    color: '#A78BFA',
    cheatSheet: {
      summary: 'Data models, relational algebra, SQL optimization, ACID guarantees, and database indexing.',
      keyConcepts: [
        { title: 'ACID Properties', desc: 'Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (persisted commits).' },
        { title: 'Normal Forms (1NF → BCNF)', desc: '1NF: Atomic values. 2NF: No partial dependency. 3NF: No transitive dependency. BCNF: Every determinant is a candidate key.' },
        { title: 'B+ Tree Indexing', desc: 'Balanced multi-way search trees used in DB indexing. All data pointers reside in leaf nodes connected via linked list.' },
      ],
      topQuestions: [
        { q: 'What is the difference between WHERE and HAVING in SQL?', a: 'WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY.' },
        { q: 'What is a candidate key vs primary key?', a: 'Candidate Key is any minimal column set uniquely identifying a row. Primary Key is the chosen candidate key.' },
      ],
    },
  },
  {
    id: 'cn',
    icon: '🌐',
    name: 'Computer Networks',
    code: 'CS601',
    qCount: 85,
    doneCount: 52,
    color: '#10B981',
    cheatSheet: {
      summary: 'Data communication, OSI 7-layer architecture, TCP/IP protocols, routing algorithms, and sockets.',
      keyConcepts: [
        { title: 'OSI 7 Layers', desc: 'Application, Presentation, Session, Transport, Network, Data Link, Physical.' },
        { title: 'TCP vs UDP', desc: 'TCP: Connection-oriented, reliable, flow-controlled, ordered. UDP: Connectionless, fast, unreliable streaming.' },
        { title: 'TCP 3-Way Handshake', desc: 'Client sends SYN → Server responds SYN-ACK → Client sends ACK.' },
      ],
      topQuestions: [
        { q: 'What happens when you type google.com into your browser?', a: 'DNS resolution → TCP Handshake → TLS Negotiation → HTTP GET request → Web Server response → DOM rendering.' },
        { q: 'What is Subnetting & CIDR?', a: 'Dividing an IP network into smaller subnetworks to optimize IP address allocation and routing efficiency.' },
      ],
    },
  },
  {
    id: 'oop',
    icon: '⚙',
    name: 'OOP & Concepts',
    code: 'CS402',
    qCount: 70,
    doneCount: 65,
    color: '#F59E0B',
    cheatSheet: {
      summary: 'Object-Oriented Programming paradigms: Encapsulation, Abstraction, Inheritance, and Polymorphism.',
      keyConcepts: [
        { title: 'Encapsulation & Abstraction', desc: 'Encapsulation binds data and methods together (access control). Abstraction hides implementation details.' },
        { title: 'Polymorphism', desc: 'Compile-time (Method Overloading) vs Run-time (Method Overriding using Virtual functions/interfaces).' },
        { title: 'Virtual Functions & VTABLE', desc: 'C++ uses a Virtual Table (vtable) and vptr to perform dynamic dispatch at runtime.' },
      ],
      topQuestions: [
        { q: 'What is the difference between Abstract Class and Interface?', a: 'Abstract Class can contain implemented methods and state; Interface defines only method contracts (until default methods).' },
      ],
    },
  },
  {
    id: 'sd',
    icon: '🔐',
    name: 'System Design',
    code: 'CS701',
    qCount: 45,
    doneCount: 22,
    color: '#EF4444',
    cheatSheet: {
      summary: 'Scalability patterns, load balancing, caching strategies, rate limiting, and microservices.',
      keyConcepts: [
        { title: 'CAP Theorem', desc: 'A distributed system can guarantee at most two of Consistency, Availability, and Partition Tolerance.' },
        { title: 'Load Balancing & Caching', desc: 'Round-Robin, Least Connections, Consistent Hashing. Redis / Memcached for in-memory caching.' },
        { title: 'Database Sharding & Replication', desc: 'Horizontal partitioning (sharding) for scale; Master-Slave replication for read availability.' },
      ],
      topQuestions: [
        { q: 'How to design a URL Shortener like Bitly?', a: 'Base62 encoding of auto-incrementing ID or MD5 hash prefix, Redis cache for hot URLs, SQL DB for persistent mapping.' },
      ],
    },
  },
  {
    id: 'apt',
    icon: '🧮',
    name: 'Aptitude & Reasoning',
    code: 'APT101',
    qCount: 110,
    doneCount: 92,
    color: '#06B6D4',
    cheatSheet: {
      summary: 'Quantitative aptitude, logical reasoning, data interpretation, and speed math shortcuts.',
      keyConcepts: [
        { title: 'Time, Speed & Distance', desc: 'Speed = Distance / Time. Average Speed = 2xy / (x + y) for equal distances.' },
        { title: 'Permutations & Combinations', desc: 'nPr = n! / (n-r)!.  nCr = n! / [r! (n-r)!].' },
        { title: 'Probability Basics', desc: 'P(A) = Favorable Outcomes / Total Outcomes. P(A or B) = P(A) + P(B) - P(A and B).' },
      ],
      topQuestions: [
        { q: 'Two trains moving in opposite directions at 60 km/h and 40 km/h. Relative speed?', a: 'Relative Speed = 60 + 40 = 100 km/h.' },
      ],
    },
  },
];

/* ── INTERVIEW FLASHCARDS BANK ────────────────────────────────────────────── */
const FLASHCARDS = [
  { subjectId: 'os', q: 'What is a deadlock and what are its 4 necessary conditions?', a: 'Deadlock occurs when processes are blocked waiting for resources held by each other. Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.' },
  { subjectId: 'os', q: 'What is the difference between a process and a thread?', a: 'A process is an independent program execution with its own memory space. A thread is a lightweight execution unit inside a process sharing memory.' },
  { subjectId: 'dbms', q: 'What are ACID properties in DBMS?', a: 'Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (committed data stays permanent).' },
  { subjectId: 'dbms', q: 'What is 3NF vs BCNF in database normalization?', a: '3NF eliminates transitive dependencies. BCNF (stricter 3NF) requires every functional dependency X -> Y to have X as a super key.' },
  { subjectId: 'cn', q: 'What is the difference between TCP and UDP?', a: 'TCP is connection-oriented, reliable, and ordered. UDP is connectionless, fast, and unreliable (used in streaming and gaming).' },
  { subjectId: 'cn', q: 'What happens during a TCP 3-Way Handshake?', a: '1. Client sends SYN. 2. Server responds with SYN-ACK. 3. Client acknowledges with ACK. Connection is established.' },
  { subjectId: 'oop', q: 'Explain Runtime Polymorphism with an example.', a: 'Method Overriding allows a derived class to provide a specific implementation of a method declared in a base class (invoked via virtual function/vtable at runtime).' },
  { subjectId: 'sd', q: 'What is CAP Theorem in Distributed Systems?', a: 'In a distributed data store, you can only provide 2 of 3 guarantees: Consistency, Availability, and Partition Tolerance.' },
  { subjectId: 'apt', q: 'Formula for Average Speed when covering equal distance at speeds x and y?', a: 'Average Speed = (2 * x * y) / (x + y).' },
];

/* ── MULTI-SUBJECT TIMED QUIZ QUESTION BANK ──────────────────────────────── */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    subject: 'Operating Systems',
    question: 'Which CPU scheduling algorithm guarantees the minimum average waiting time for a given set of processes?',
    options: ['First Come First Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin Scheduling', 'Priority Scheduling'],
    correct: 1,
    explanation: 'Shortest Job First (SJF) is mathematically optimal because executing shorter tasks first minimizes the total accumulated waiting time.',
  },
  {
    id: 2,
    subject: 'DBMS',
    question: 'Which normal form eliminates partial dependencies where a non-key attribute depends on a proper subset of a candidate key?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correct: 1,
    explanation: '2NF requires the relation to be in 1NF and guarantees that every non-prime attribute is fully functionally dependent on primary key.',
  },
  {
    id: 3,
    subject: 'Computer Networks',
    question: 'At which layer of the OSI model does the Internet Protocol (IP) operate?',
    options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
    correct: 1,
    explanation: 'The IP protocol operates at Layer 3 (Network Layer) and handles packet routing and logical IP addressing.',
  },
  {
    id: 4,
    subject: 'OOP',
    question: 'Which object-oriented programming mechanism allows a single interface to represent different underlying data types?',
    options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
    correct: 2,
    explanation: 'Polymorphism ("many forms") enables a method or interface to behave differently based on the calling object.',
  },
  {
    id: 5,
    subject: 'System Design',
    question: 'Which algorithm is widely used in distributed caching to minimize key re-mapping when nodes are added or removed?',
    options: ['Round Robin Hashing', 'Consistent Hashing', 'MD5 Hashing', 'Linear Probing'],
    correct: 1,
    explanation: 'Consistent Hashing maps both keys and servers to a virtual ring, ensuring only K/n keys need re-location when a node changes.',
  },
  {
    id: 6,
    subject: 'Aptitude',
    question: 'A train 150m long crosses a telegraph pole in 9 seconds. What is the speed of the train in km/h?',
    options: ['50 km/h', '60 km/h', '72 km/h', '80 km/h'],
    correct: 1,
    explanation: 'Speed = Distance / Time = 150 / 9 = 50/3 m/s. In km/h: (50/3) * (18/5) = 60 km/h.',
  },
];

/* ── REVISION CHEAT SHEET MODAL ───────────────────────────────────────────── */
function CheatSheetModal({ subject, onClose }: { subject: SubjectItem; onClose: () => void }) {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="dashboard-widget-card" style={{ width: '600px', maxHeight: '85vh', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{subject.icon}</span>
            <div>
              <span className="widget-title" style={{ fontSize: '16px' }}>{subject.name} — Cheat Sheet</span>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Code: {subject.code} · Essential Interview Revision</div>
            </div>
          </div>
          <button className="warmup-btn-dark" onClick={onClose} style={{ padding: '2px 8px' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Summary Box */}
          <div style={{ background: '#1A1C28', padding: '12px 14px', borderRadius: '8px', borderLeft: `3px solid ${subject.color}` }}>
            <div style={{ fontSize: '12px', color: '#D1D5DB', lineHeight: 1.6 }}>{subject.cheatSheet.summary}</div>
          </div>

          {/* Key Concepts */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>⚡ Core Principles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subject.cheatSheet.keyConcepts.map((kc, i) => (
                <div key={i} style={{ background: '#1A1C28', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: subject.color, marginBottom: '4px' }}>{i + 1}. {kc.title}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: 1.5 }}>{kc.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Interview Q&As */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>🎯 Top Interview Questions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subject.cheatSheet.topQuestions.map((tq, i) => (
                <div key={i} style={{ background: 'rgba(124,58,237,0.08)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Q: {tq.q}</div>
                  <div style={{ fontSize: '11px', color: '#10B981', lineHeight: 1.5 }}>A: {tq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="warmup-btn-purple" onClick={onClose}>Done Revising ✓</button>
        </div>
      </div>
    </div>
  );
}

/* ── TIMED QUIZ ASSESSMENT MODAL ─────────────────────────────────────────── */
function PlacementQuizModal({ onClose }: { onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft]     = useState(180);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const handleSelect = (optIdx: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const score = calculateScore();
  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const finishAssessment = async () => {
    setIsSubmitted(true);
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quiz_completed', score, total: QUIZ_QUESTIONS.length }),
      });
    } catch {}
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="dashboard-widget-card" style={{ width: '560px', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className="widget-title" style={{ fontSize: '16px' }}>⏱ CS Placement Mock Assessment</span>
          <button className="warmup-btn-dark" onClick={onClose} style={{ padding: '2px 8px' }}>✕</button>
        </div>

        {!isSubmitted ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', background: '#1A1C28', padding: '8px 14px', borderRadius: '20px' }}>
              <span style={{ fontSize: '12px', color: '#A78BFA', fontWeight: 600 }}>
                Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: timeLeft < 30 ? '#EF4444' : '#38BDF8', fontWeight: 700 }}>
                ⏳ {formatTime(timeLeft)}
              </span>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <span className="prep-tag-pill" style={{ marginBottom: '6px', display: 'inline-block' }}>{currentQ.subject}</span>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>{currentQ.question}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {currentQ.options.map((opt, oIdx) => {
                const selected = answers[currentIdx] === oIdx;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(oIdx)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: selected ? 'rgba(124,58,237,0.2)' : '#1A1C28',
                      border: `1px solid ${selected ? '#7C3AED' : 'rgba(255,255,255,0.06)'}`,
                      color: selected ? '#A78BFA' : '#D1D5DB',
                      fontWeight: selected ? 600 : 400,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {String.fromCharCode(65 + oIdx)}. {opt}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                className="warmup-btn-dark"
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
              >
                ← Prev
              </button>
              {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
                <button className="warmup-btn-purple" onClick={() => setCurrentIdx(i => i + 1)}>
                  Next →
                </button>
              ) : (
                <button className="warmup-btn-purple" onClick={finishAssessment}>
                  Submit Test ✓
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎯</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Assessment Completed!</h2>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>
              You scored <span style={{ color: '#10B981', fontWeight: 700 }}>{score} / {QUIZ_QUESTIONS.length}</span> ({((score / QUIZ_QUESTIONS.length) * 100).toFixed(0)}%)
            </p>

            <div style={{ background: '#1A1C28', borderRadius: '8px', padding: '14px', textAlign: 'left', marginBottom: '16px', maxHeight: '220px', overflowY: 'auto' }}>
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: '10px', borderBottom: idx !== QUIZ_QUESTIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: answers[idx] === q.correct ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                    {answers[idx] === q.correct ? '✓ Correct' : '✕ Incorrect'} — Q{idx + 1}: {q.question}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    Correct: <strong style={{ color: '#fff' }}>{q.options[q.correct]}</strong>
                  </div>
                </div>
              ))}
            </div>

            <button className="warmup-btn-purple" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Close & Save Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── COMPANY DEEP-DIVE MODAL WITH PAST QUESTIONS & SCRAPER ───────────────── */
function CompanyDetailModal({
  company,
  onClose,
  onSolveInWorkspace,
}: {
  company: CompanyTrack;
  onClose: () => void;
  onSolveInWorkspace: (q: QuestionItem) => void;
}) {
  const [activeTab, setActiveTab] = useState<'questions' | 'syllabus'>('questions');
  const [qFilter, setQFilter]     = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  // Scraper State
  const [questions, setQuestions] = useState<QuestionItem[]>(company.pastQuestions || []);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState<string | null>(null);

  const handleRunScraper = async () => {
    setIsScraping(true);
    setScrapeStatus(`🌐 Connecting to GeeksforGeeks, LeetCode & Campus Archives for ${company.name}...`);
    try {
      const res = await fetch('/api/placement/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: company.id, companyName: company.name }),
      });
      const data = await res.json();
      if (data.success && data.questions) {
        // Merge without duplicate IDs
        const existingIds = new Set(questions.map(q => q.id));
        const newQs = data.questions.filter((q: QuestionItem) => !existingIds.has(q.id));
        setQuestions(prev => [...prev, ...newQs]);
        setScrapeStatus(`✅ Successfully fetched ${data.questions.length} past questions from 5 web sources!`);
      } else {
        setScrapeStatus('⚠️ Web scraper returned default past dataset.');
      }
    } catch (e: any) {
      setScrapeStatus('❌ Scraper connection failed. Loaded offline dataset.');
    } finally {
      setIsScraping(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesCat = qFilter === 'All' || q.category === qFilter;
    const matchesYr  = yearFilter === 'All' || q.year === yearFilter;
    return matchesCat && matchesYr;
  });

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="dashboard-widget-card" style={{
        width: '850px', maxWidth: '95vw', maxHeight: '90vh', background: '#0F1017', border: `1px solid ${company.color}40`, padding: '24px', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '36px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '12px' }}>{company.logo}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{company.name} Placement Track</h2>
                <span style={{ fontSize: '11px', fontWeight: 700, color: company.color, background: `${company.color}20`, padding: '2px 10px', borderRadius: '12px', border: `1px solid ${company.color}40` }}>
                  {company.difficulty}
                </span>
                <span className="prep-tag-pill">{company.category}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                💰 Avg Package: <strong style={{ color: '#10B981' }}>{company.avgPackage}</strong> · Eligibility: {company.eligibility}
              </div>
            </div>
          </div>
          <button className="warmup-btn-dark" onClick={onClose} style={{ padding: '4px 10px', fontSize: '14px' }}>✕</button>
        </div>

        {/* Tab & Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('questions')}
              style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                background: activeTab === 'questions' ? company.color : '#1A1C28',
                color: '#fff', border: 'none', transition: 'all 0.15s ease'
              }}
            >
              📜 Past Questions Archive ({filteredQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                background: activeTab === 'syllabus' ? company.color : '#1A1C28',
                color: '#fff', border: 'none', transition: 'all 0.15s ease'
              }}
            >
              📋 Syllabus & Interview Rounds
            </button>
          </div>

          <button
            onClick={handleRunScraper}
            disabled={isScraping}
            style={{
              padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              background: isScraping ? '#374151' : 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
              color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {isScraping ? '🔄 Scraping Web Sources...' : '🌐 Scrape Latest 2025-2026 Questions'}
          </button>
        </div>

        {/* Scrape Status Banner */}
        {scrapeStatus && (
          <div style={{ background: '#1A1C28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#38BDF8', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{scrapeStatus}</span>
            <button onClick={() => setScrapeStatus(null)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {activeTab === 'questions' ? (
            <div>
              {/* Category & Year Filter Bar */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <select
                  value={qFilter}
                  onChange={e => setQFilter(e.target.value)}
                  style={{ background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
                >
                  <option value="All">All Categories</option>
                  <option value="Coding / DSA">Coding / DSA</option>
                  <option value="CS Core">CS Core (OS/DBMS/CN)</option>
                  <option value="Aptitude & Reasoning">Aptitude & Reasoning</option>
                  <option value="System Design / OOD">System Design / OOD</option>
                  <option value="Behavioral / HR">Behavioral / HR</option>
                </select>

                <select
                  value={yearFilter}
                  onChange={e => setYearFilter(e.target.value)}
                  style={{ background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
                >
                  <option value="All">All Batches / Years</option>
                  <option value="2026">2026 Batch</option>
                  <option value="2025">2025 Batch</option>
                  <option value="2024">2024 Batch</option>
                  <option value="2023">2023 Batch</option>
                </select>
              </div>

              {/* Questions Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredQuestions.map(q => {
                  const isExp = expandedQId === q.id;
                  return (
                    <div
                      key={q.id}
                      style={{
                        background: '#1A1C28', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(124,58,237,0.2)', color: '#A78BFA' }}>
                              {q.category}
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.2)', color: '#10B981' }}>
                              {q.difficulty}
                            </span>
                            <span style={{ fontSize: '10px', color: '#9CA3AF' }}>📅 Batch {q.year}</span>
                            <span style={{ fontSize: '10px', color: '#F59E0B' }}>🔥 {q.frequency}</span>
                          </div>

                          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{q.title}</h4>
                          <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.5, marginBottom: '8px' }}>{q.description}</p>

                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {q.topics.map(t => (
                              <span key={t} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', color: '#D1D5DB', padding: '2px 8px', borderRadius: '4px' }}>
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '130px', alignItems: 'flex-end' }}>
                          <button
                            onClick={() => onSolveInWorkspace(q)}
                            className="warmup-btn-purple"
                            style={{ fontSize: '11px', padding: '6px 12px', width: '100%', justifyContent: 'center' }}
                          >
                            ⚡ Code in Editor
                          </button>
                          <button
                            onClick={() => setExpandedQId(isExp ? null : q.id)}
                            className="warmup-btn-dark"
                            style={{ fontSize: '11px', padding: '4px 10px', width: '100%', justifyContent: 'center' }}
                          >
                            {isExp ? 'Hide Hint ▲' : 'View Hint ▼'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Solution Hint Drawer */}
                      {isExp && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(16,185,129,0.05)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
                          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, marginBottom: '4px' }}>💡 Solution Strategy / Approach:</div>
                          <div style={{ fontSize: '12px', color: '#D1D5DB', lineHeight: 1.5 }}>{q.solutionHint}</div>
                          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>Source Archive: {q.source}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#1A1C28', padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>📋 Round-by-Round Breakdown</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {company.rounds.map((r, i) => (
                    <div key={i} style={{ background: '#12131A', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${company.color}` }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{r}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#1A1C28', padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>🎯 High-Frequency Focus Topics</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {company.focusTopics.map(topic => (
                    <span key={topic} style={{ background: `${company.color}20`, color: company.color, border: `1px solid ${company.color}40`, padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── MAIN PLACEMENT ARENA PAGE ────────────────────────────────────────────── */
export default function PlacementPage() {
  const router = useRouter();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery]       = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyTrack | null>(null);

  const [activeSubjectFilter, setActiveSubjectFilter] = useState('All');
  const [cardIdx, setCardIdx]               = useState(0);
  const [flipped, setFlipped]               = useState(false);
  const [showQuiz, setShowQuiz]             = useState(false);
  const [activeCheatSheet, setActiveCheatSheet] = useState<SubjectItem | null>(null);

  // Filter company tracks
  const filteredCompanies = COMPANY_TRACKS.filter(comp => {
    const matchesCat = categoryFilter === 'All' || comp.category === categoryFilter;
    const matchesSearch = searchQuery === '' ||
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.focusTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      comp.pastQuestions.some(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const filteredFlashcards = FLASHCARDS.filter(fc => {
    return activeSubjectFilter === 'All' || fc.subjectId === activeSubjectFilter;
  });

  const nextCard = () => {
    if (filteredFlashcards.length === 0) return;
    setCardIdx((i) => (i + 1) % filteredFlashcards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    if (filteredFlashcards.length === 0) return;
    setCardIdx((i) => (i - 1 + filteredFlashcards.length) % filteredFlashcards.length);
    setFlipped(false);
  };

  const currentFlashcard = filteredFlashcards[cardIdx % (filteredFlashcards.length || 1)];

  const handleSolveInWorkspace = (q: QuestionItem) => {
    const encodedTitle = encodeURIComponent(q.title);
    const platform = q.category === 'Coding / DSA' ? 'leetcode' : 'hackerrank';
    router.push(`/workspace?problem=${encodedTitle}&company=${selectedCompany?.id || 'placement'}&platform=${platform}`);
  };

  return (
    <div className="dashboard-container" style={{ paddingBottom: '30px' }}>
      {/* ── Banner Hero Card ── */}
      <div className="dashboard-hero-card" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="hero-title">💼 Placement Hub & Past Questions Archive</h1>
          <p className="hero-subtitle">Top Product & Service Companies (2020-2026 Past Papers) · CS Revision · Live Web Scraper</p>
        </div>
        <div className="hero-actions">
          <button className="btn-hero-purple" onClick={() => setShowQuiz(true)}>
            ⏱ Start Timed Placement Quiz
          </button>
        </div>
      </div>

      {/* ── Search Bar & Category Filters ── */}
      <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search company (e.g. Google, TCS, Amazon), topic (DP, SQL), or question..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1, minWidth: '280px', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)',
              padding: '10px 16px', borderRadius: '10px', color: '#fff', fontSize: '13px', outline: 'none'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: 'All Companies' },
            { id: 'Product Giants', label: 'Product Giants 🚀' },
            { id: 'Indian Unicorns', label: 'Indian Unicorns 🦄' },
            { id: 'Service & Consultancies', label: 'Service Tech 🏢' },
            { id: 'Fintech & Quant', label: 'Fintech & Quant 🏦' },
          ].map(cat => {
            const active = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  background: active ? '#7C3AED' : '#12131A',
                  color: active ? '#fff' : '#9CA3AF',
                  border: `1px solid ${active ? '#7C3AED' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Company Grid Section ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            🎯 Target Company Interview Tracks & Past Papers ({filteredCompanies.length})
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
          {filteredCompanies.map(track => (
            <div
              key={track.id}
              onClick={() => setSelectedCompany(track)}
              style={{
                background: '#12131A',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '18px', cursor: 'pointer',
                transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = track.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px', background: 'rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: '8px' }}>{track.logo}</span>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{track.name}</h3>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{track.avgPackage}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: track.color, background: `${track.color}15`, padding: '2px 8px', borderRadius: '12px', border: `1px solid ${track.color}30` }}>
                    {track.difficulty}
                  </span>
                </div>

                {/* Topics preview */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {track.focusTopics.slice(0, 3).map(t => (
                    <span key={t} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#D1D5DB' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>
                  <span>Readiness: <strong style={{ color: track.color }}>{track.readiness}%</strong></span>
                  <span style={{ color: '#A78BFA', fontWeight: 600 }}>{track.pastQuestionsCount}+ Past Qs</span>
                </div>

                <button
                  className="warmup-btn-dark"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '6px', marginTop: '6px' }}
                >
                  Explore Track & Past Qs →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Split: Flashcards & CS Subject Revision ── */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>

        {/* Left Column: Flashcards Deck */}
        <div className="dashboard-widget-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="widget-header" style={{ marginBottom: '14px' }}>
            <div className="widget-icon-box">🃏</div>
            <span className="widget-title">High-Yield Flashcards</span>
            <select
              value={activeSubjectFilter}
              onChange={e => { setActiveSubjectFilter(e.target.value); setCardIdx(0); setFlipped(false); }}
              style={{ background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', outline: 'none' }}
            >
              <option value="All">All Subjects</option>
              <option value="os">OS</option>
              <option value="dbms">DBMS</option>
              <option value="cn">Networks</option>
              <option value="oop">OOP</option>
              <option value="sd">System Design</option>
              <option value="apt">Aptitude</option>
            </select>
          </div>

          {/* Flashcard Box */}
          {currentFlashcard ? (
            <div
              id="flashcard"
              onClick={() => setFlipped(f => !f)}
              style={{
                flex: 1, minHeight: '160px',
                background: flipped ? 'rgba(16, 185, 129, 0.08)' : 'rgba(124, 58, 237, 0.08)',
                border: `1px solid ${flipped ? 'rgba(16, 185, 129, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
                borderRadius: '12px', padding: '20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', transition: 'all 0.3s ease',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: flipped ? '#10B981' : '#A78BFA', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>
                  {flipped ? '✓ ANSWER' : '❓ QUESTION (Click card to flip)'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>
                  {flipped ? currentFlashcard.a : currentFlashcard.q}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '12px' }}>No flashcards found for selected subject.</div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center' }}>
            <button id="btn-prev-card" onClick={prevCard} className="warmup-btn-dark" style={{ padding: '4px 12px' }}>← Prev</button>
            <span style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#9CA3AF' }}>
              {filteredFlashcards.length > 0 ? (cardIdx % filteredFlashcards.length) + 1 : 0} / {filteredFlashcards.length}
            </span>
            <button id="btn-next-card" onClick={nextCard} className="warmup-btn-dark" style={{ padding: '4px 12px' }}>Next →</button>
          </div>
        </div>

        {/* Right Column: CS Subject Revision Cards */}
        <div className="dashboard-widget-card">
          <div className="widget-header" style={{ marginBottom: '14px' }}>
            <div className="widget-icon-box">📚</div>
            <span className="widget-title">CS Core & Aptitude Progress</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CS_SUBJECTS.map(subj => {
              const pct = Math.round((subj.doneCount / subj.qCount) * 100);
              return (
                <div key={subj.id} style={{ background: '#1A1C28', borderRadius: '8px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{subj.icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{subj.name}</span>
                    </div>
                    <button
                      className="warmup-btn-dark"
                      style={{ fontSize: '11px', padding: '2px 8px' }}
                      onClick={() => setActiveCheatSheet(subj)}
                    >
                      Revision Notes 📖
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF', marginBottom: '5px' }}>
                    <span>Progress: {subj.doneCount} / {subj.qCount} solved</span>
                    <span style={{ color: subj.color, fontWeight: 700 }}>{pct}%</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '100px', height: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: subj.color, borderRadius: '100px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Modals ── */}
      {showQuiz && <PlacementQuizModal onClose={() => setShowQuiz(false)} />}
      {activeCheatSheet && <CheatSheetModal subject={activeCheatSheet} onClose={() => setActiveCheatSheet(null)} />}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onSolveInWorkspace={handleSolveInWorkspace}
        />
      )}
    </div>
  );
}
