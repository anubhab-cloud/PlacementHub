'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid var(--violet)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Initializing Monaco Editor...
    </div>
  ),
});

/* ── Types ───────────────────────────────────────────────────────────── */
export interface Problem {
  id: number;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string; explain?: string }[];
  defaultStdin: string;
  templates: { cpp: string; java: string; python: string; javascript: string };
  tags?: string[];
  acRate?: number;
  titleSlug?: string;
  platform?: 'leetcode' | 'hackerrank' | 'placementhub';
  points?: number;
}

type RunResult = {
  status: { id: number; description: string };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;
  memory: number | null;
  engine?: string;
  demo?: boolean;
  message?: string;
  error?: string;
};

/* ── Built-in Blind 75 Problem Bank ─────────────────────────────────── */
const BUILTIN_PROBLEMS: Problem[] = [
  {
    id: 1, title: 'Two Sum', topic: 'Arrays & Hashing', difficulty: 'Easy', acRate: 52.3,
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explain: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    defaultStdin: '2 7 11 15\n9',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for (int i = 0; i < nums.size(); i++) {\n        if (mp.count(target - nums[i])) {\n            return {mp[target - nums[i]], i};\n        }\n        mp[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    int target = 9;\n    auto res = twoSum(nums, target);\n    cout << "[" << res[0] << ", " << res[1] << "]" << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (map.containsKey(target - nums[i])) {\n                return new int[]{map.get(target - nums[i]), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println(Arrays.toString(res));\n    }\n}`,
      python: `from typing import List\n\ndef twoSum(nums: List[int], target: int) -> List[int]:\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []\n\nprint(twoSum([2, 7, 11, 15], 9))`,
      javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
    },
  },
  {
    id: 3, title: 'Longest Substring Without Repeating Characters', topic: 'Sliding Window', difficulty: 'Medium', acRate: 34.1,
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explain: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explain: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explain: 'The answer is "wke", with the length of 3.' },
    ],
    defaultStdin: 'abcabcbb',
    templates: {
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    unordered_set<char> st;\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < s.length(); right++) {\n        while (st.count(s[right])) {\n            st.erase(s[left++]);\n        }\n        st.insert(s[right]);\n        maxLen = max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\n\nint main() {\n    cout << lengthOfLongestSubstring("abcabcbb") << endl;\n    return 0;\n}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    char_set = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint(lengthOfLongestSubstring("abcabcbb"))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (set.contains(s.charAt(right))) {\n                set.remove(s.charAt(left++));\n            }\n            set.add(s.charAt(right));\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n    public static void main(String[] args) {\n        System.out.println(lengthOfLongestSubstring("abcabcbb"));\n    }\n}`,
      javascript: `function lengthOfLongestSubstring(s) {\n    let set = new Set(), left = 0, maxLen = 0;\n    for (let right = 0; right < s.length; right++) {\n        while (set.has(s[right])) {\n            set.delete(s[left++]);\n        }\n        set.add(s[right]);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\nconsole.log(lengthOfLongestSubstring("abcabcbb"));`,
    },
  },
  {
    id: 15, title: '3Sum', topic: 'Two Pointers', difficulty: 'Medium', acRate: 32.8,
    tags: ['Array', 'Two Pointers', 'Sorting'],
    description: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.',
    examples: [{ input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' }],
    defaultStdin: '-1 0 1 2 -1 -4',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> threeSum(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    vector<vector<int>> res;\n    for (int i = 0; i < nums.size(); i++) {\n        if (i > 0 && nums[i] == nums[i-1]) continue;\n        int l = i + 1, r = nums.size() - 1;\n        while (l < r) {\n            int sum = nums[i] + nums[l] + nums[r];\n            if (sum < 0) l++;\n            else if (sum > 0) r--;\n            else {\n                res.push_back({nums[i], nums[l], nums[r]});\n                while (l < r && nums[l] == nums[l+1]) l++;\n                while (l < r && nums[r] == nums[r-1]) r--;\n                l++; r--;\n            }\n        }\n    }\n    return res;\n}\n\nint main() {\n    vector<int> nums = {-1,0,1,2,-1,-4};\n    auto res = threeSum(nums);\n    cout << "Found " << res.size() << " triplets" << endl;\n    return 0;\n}`,
      python: `from typing import List\n\ndef threeSum(nums: List[int]) -> List[List[int]]:\n    nums.sort()\n    res = []\n    for i in range(len(nums)):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s < 0: l += 1\n            elif s > 0: r -= 1\n            else:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]: l += 1\n                while l < r and nums[r] == nums[r-1]: r -= 1\n                l += 1; r -= 1\n    return res\n\nprint(threeSum([-1,0,1,2,-1,-4]))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum < 0) l++;\n                else if (sum > 0) r--;\n                else {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                }\n            }\n        }\n        return res;\n    }\n    public static void main(String[] args) {\n        System.out.println(threeSum(new int[]{-1,0,1,2,-1,-4}));\n    }\n}`,
      javascript: `function threeSum(nums) {\n    nums.sort((a,b) => a-b);\n    const res = [];\n    for (let i = 0; i < nums.length; i++) {\n        if (i > 0 && nums[i] === nums[i-1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const sum = nums[i] + nums[l] + nums[r];\n            if (sum < 0) l++;\n            else if (sum > 0) r--;\n            else {\n                res.push([nums[i], nums[l], nums[r]]);\n                while (l < r && nums[l] === nums[l+1]) l++;\n                while (l < r && nums[r] === nums[r-1]) r--;\n                l++; r--;\n            }\n        }\n    }\n    return res;\n}\nconsole.log(threeSum([-1,0,1,2,-1,-4]));`,
    },
  },
  {
    id: 20, title: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy', acRate: 40.2,
    tags: ['String', 'Stack'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n- Open brackets must be closed by the same type of brackets.\n- Open brackets must be closed in the correct order.\n- Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    defaultStdin: '()[]{}',
    templates: {
      cpp: `#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(') st.push(')');\n        else if (c == '{') st.push('}');\n        else if (c == '[') st.push(']');\n        else {\n            if (st.empty() || st.top() != c) return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}\n\nint main() {\n    cout << (isValid("()[]{}") ? "true" : "false") << endl;\n    return 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n\nprint(isValid("()[]{}"))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n    public static void main(String[] args) {\n        System.out.println(isValid("()[]{}"));\n    }\n}`,
      javascript: `function isValid(s) {\n    const stack = [];\n    for (let c of s) {\n        if (c === '(') stack.push(')');\n        else if (c === '{') stack.push('}');\n        else if (c === '[') stack.push(']');\n        else if (stack.pop() !== c) return false;\n    }\n    return stack.length === 0;\n}\nconsole.log(isValid("()[]{}"));`,
    },
  },
  {
    id: 21, title: 'Merge Two Sorted Lists', topic: 'Linked Lists', difficulty: 'Easy', acRate: 62.4,
    tags: ['Linked List', 'Recursion'],
    description: 'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
    ],
    defaultStdin: '1 2 4\n1 3 4',
    templates: {
      cpp: `#include <iostream>\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    if (!l1) return l2;\n    if (!l2) return l1;\n    if (l1->val <= l2->val) {\n        l1->next = mergeTwoLists(l1->next, l2);\n        return l1;\n    }\n    l2->next = mergeTwoLists(l1, l2->next);\n    return l2;\n}\n\nint main() {\n    ListNode* l1 = new ListNode(1);\n    l1->next = new ListNode(2);\n    l1->next->next = new ListNode(4);\n    ListNode* l2 = new ListNode(1);\n    l2->next = new ListNode(3);\n    l2->next->next = new ListNode(4);\n    ListNode* merged = mergeTwoLists(l1, l2);\n    while (merged) {\n        cout << merged->val << " ";\n        merged = merged->next;\n    }\n    cout << endl;\n    return 0;\n}`,
      python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef mergeTwoLists(l1, l2):\n    if not l1: return l2\n    if not l2: return l1\n    if l1.val <= l2.val:\n        l1.next = mergeTwoLists(l1.next, l2)\n        return l1\n    l2.next = mergeTwoLists(l1, l2.next)\n    return l2\n\n# Build and print\nl1 = ListNode(1, ListNode(2, ListNode(4)))\nl2 = ListNode(1, ListNode(3, ListNode(4)))\nnode = mergeTwoLists(l1, l2)\nwhile node:\n    print(node.val, end=' ')\n    node = node.next\nprint()`,
      java: `public class Solution {\n    static class ListNode {\n        int val;\n        ListNode next;\n        ListNode(int x) { val = x; }\n    }\n    public static ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n        if (l1 == null) return l2;\n        if (l2 == null) return l1;\n        if (l1.val <= l2.val) {\n            l1.next = mergeTwoLists(l1.next, l2);\n            return l1;\n        }\n        l2.next = mergeTwoLists(l1, l2.next);\n        return l2;\n    }\n    public static void main(String[] args) {\n        System.out.println("Merged two sorted lists successfully");\n    }\n}`,
      javascript: `function mergeTwoLists(l1, l2) {\n    if (!l1) return l2;\n    if (!l2) return l1;\n    if (l1.val <= l2.val) {\n        l1.next = mergeTwoLists(l1.next, l2);\n        return l1;\n    }\n    l2.next = mergeTwoLists(l1, l2.next);\n    return l2;\n}\nconsole.log("Merge Two Sorted Lists solution ready");`,
    },
  },
  {
    id: 70, title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', acRate: 52.5,
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explain: 'There are two ways to climb to the top: 1 step + 1 step, 2 steps.' },
      { input: 'n = 3', output: '3', explain: 'There are three ways: 1+1+1, 1+2, 2+1.' },
    ],
    defaultStdin: '5',
    templates: {
      cpp: `#include <iostream>\nusing namespace std;\n\nint climbStairs(int n) {\n    if (n <= 2) return n;\n    int prev1 = 1, prev2 = 2;\n    for (int i = 3; i <= n; i++) {\n        int curr = prev1 + prev2;\n        prev1 = prev2;\n        prev2 = curr;\n    }\n    return prev2;\n}\n\nint main() {\n    cout << climbStairs(5) << endl;\n    return 0;\n}`,
      python: `def climbStairs(n: int) -> int:\n    if n <= 2:\n        return n\n    prev1, prev2 = 1, 2\n    for _ in range(3, n + 1):\n        prev1, prev2 = prev2, prev1 + prev2\n    return prev2\n\nprint(climbStairs(5))`,
      java: `public class Solution {\n    public static int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev1 = 1, prev2 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev1 = prev2;\n            prev2 = curr;\n        }\n        return prev2;\n    }\n    public static void main(String[] args) {\n        System.out.println(climbStairs(5));\n    }\n}`,
      javascript: `function climbStairs(n) {\n    if (n <= 2) return n;\n    let prev1 = 1, prev2 = 2;\n    for (let i = 3; i <= n; i++) {\n        [prev1, prev2] = [prev2, prev1 + prev2];\n    }\n    return prev2;\n}\nconsole.log(climbStairs(5));`,
    },
  },
  {
    id: 104, title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', acRate: 75.2,
    tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'],
    description: 'Given the `root` of a binary tree, return its maximum depth.\n\nA binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
      { input: 'root = [1,null,2]', output: '2' },
    ],
    defaultStdin: '3',
    templates: {
      cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nint maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}\n\nint main() {\n    TreeNode* root = new TreeNode(3);\n    root->left = new TreeNode(9);\n    root->right = new TreeNode(20);\n    root->right->left = new TreeNode(15);\n    root->right->right = new TreeNode(7);\n    cout << maxDepth(root) << endl;\n    return 0;\n}`,
      python: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef maxDepth(root) -> int:\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))\n\nroot = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\nprint(maxDepth(root))`,
      java: `public class Solution {\n    static class TreeNode {\n        int val;\n        TreeNode left, right;\n        TreeNode(int x) { val = x; }\n    }\n    public static int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n    public static void main(String[] args) {\n        System.out.println("Max depth calculated");\n    }\n}`,
      javascript: `function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\nconsole.log("Max Depth of Binary Tree solution ready");`,
    },
  },
  {
    id: 121, title: 'Best Time to Buy and Sell Stock', topic: 'Sliding Window', difficulty: 'Easy', acRate: 53.3,
    tags: ['Array', 'Dynamic Programming'],
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explain: 'Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explain: 'In this case, no transactions are done and the max profit = 0.' },
    ],
    defaultStdin: '7 1 5 3 6 4',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    int minPrice = INT_MAX, maxProfit = 0;\n    for (int price : prices) {\n        minPrice = min(minPrice, price);\n        maxProfit = max(maxProfit, price - minPrice);\n    }\n    return maxProfit;\n}\n\nint main() {\n    vector<int> prices = {7, 1, 5, 3, 6, 4};\n    cout << maxProfit(prices) << endl;\n    return 0;\n}`,
      python: `from typing import List\n\ndef maxProfit(prices: List[int]) -> int:\n    min_price = float('inf')\n    max_profit = 0\n    for price in prices:\n        min_price = min(min_price, price)\n        max_profit = max(max_profit, price - min_price)\n    return max_profit\n\nprint(maxProfit([7, 1, 5, 3, 6, 4]))`,
      java: `public class Solution {\n    public static int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE, maxProfit = 0;\n        for (int price : prices) {\n            minPrice = Math.min(minPrice, price);\n            maxProfit = Math.max(maxProfit, price - minPrice);\n        }\n        return maxProfit;\n    }\n    public static void main(String[] args) {\n        System.out.println(maxProfit(new int[]{7,1,5,3,6,4}));\n    }\n}`,
      javascript: `function maxProfit(prices) {\n    let minPrice = Infinity, maxProfit = 0;\n    for (const price of prices) {\n        minPrice = Math.min(minPrice, price);\n        maxProfit = Math.max(maxProfit, price - minPrice);\n    }\n    return maxProfit;\n}\nconsole.log(maxProfit([7,1,5,3,6,4]));`,
    },
  },
  {
    id: 200, title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', acRate: 58.9,
    tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'],
    description: 'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    ],
    defaultStdin: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid dfs(vector<vector<char>>& grid, int r, int c) {\n    int m = grid.size(), n = grid[0].size();\n    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] == '0') return;\n    grid[r][c] = '0';\n    dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);\n}\n\nint numIslands(vector<vector<char>>& grid) {\n    int count = 0;\n    for (int i = 0; i < grid.size(); i++) {\n        for (int j = 0; j < grid[0].size(); j++) {\n            if (grid[i][j] == '1') { count++; dfs(grid, i, j); }\n        }\n    }\n    return count;\n}\n\nint main() {\n    vector<vector<char>> g = {{'1','1','0'},{'1','0','0'},{'0','0','1'}};\n    cout << "Islands: " << numIslands(g) << endl;\n    return 0;\n}`,
      python: `from typing import List\n\ndef numIslands(grid: List[List[str]]) -> int:\n    if not grid: return 0\n    m, n = len(grid), len(grid[0])\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= m or c >= n or grid[r][c] == '0': return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    islands = 0\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == '1':\n                islands += 1\n                dfs(i, j)\n    return islands\n\nprint(numIslands([['1','1','0'],['1','0','0'],['0','0','1']]))`,
      java: `public class Solution {\n    public static int numIslands(char[][] grid) {\n        int count = 0;\n        for (int i = 0; i < grid.length; i++)\n            for (int j = 0; j < grid[0].length; j++)\n                if (grid[i][j] == '1') { count++; dfs(grid, i, j); }\n        return count;\n    }\n    private static void dfs(char[][] grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') return;\n        grid[r][c] = '0';\n        dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);\n    }\n    public static void main(String[] args) { System.out.println("Islands counted"); }\n}`,
      javascript: `function numIslands(grid) {\n    let count = 0;\n    function dfs(r, c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === '0') return;\n        grid[r][c] = '0';\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);\n    }\n    for (let i = 0; i < grid.length; i++)\n        for (let j = 0; j < grid[0].length; j++)\n            if (grid[i][j] === '1') { count++; dfs(i, j); }\n    return count;\n}\nconsole.log(numIslands([['1','1','0'],['1','0','0'],['0','0','1']]));`,
    },
  },
  {
    id: 206, title: 'Reverse Linked List', topic: 'Linked Lists', difficulty: 'Easy', acRate: 74.6,
    tags: ['Linked List', 'Recursion'],
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
    ],
    defaultStdin: '1 2 3 4 5',
    templates: {
      cpp: `#include <iostream>\nusing namespace std;\n\nstruct ListNode { int val; ListNode* next; ListNode(int x): val(x), next(nullptr){} };\n\nListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    while (head) {\n        ListNode* next = head->next;\n        head->next = prev;\n        prev = head;\n        head = next;\n    }\n    return prev;\n}\n\nint main() {\n    ListNode* head = new ListNode(1);\n    head->next = new ListNode(2);\n    head->next->next = new ListNode(3);\n    head->next->next->next = new ListNode(4);\n    head->next->next->next->next = new ListNode(5);\n    ListNode* rev = reverseList(head);\n    while (rev) { cout << rev->val << " "; rev = rev->next; }\n    cout << endl;\n    return 0;\n}`,
      python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head):\n    prev = None\n    while head:\n        nxt = head.next\n        head.next = prev\n        prev = head\n        head = nxt\n    return prev\n\nhead = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))\nrev = reverseList(head)\nwhile rev:\n    print(rev.val, end=' ')\n    rev = rev.next\nprint()`,
      java: `public class Solution {\n    static class ListNode { int val; ListNode next; ListNode(int x) { val = x; } }\n    public static ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        while (head != null) {\n            ListNode next = head.next;\n            head.next = prev;\n            prev = head;\n            head = next;\n        }\n        return prev;\n    }\n    public static void main(String[] args) { System.out.println("Reverse Linked List done"); }\n}`,
      javascript: `function reverseList(head) {\n    let prev = null;\n    while (head) {\n        const next = head.next;\n        head.next = prev;\n        prev = head;\n        head = next;\n    }\n    return prev;\n}\nconsole.log("Reverse Linked List solution ready");`,
    },
  },
  {
    id: 238, title: 'Product of Array Except Self', topic: 'Arrays & Hashing', difficulty: 'Medium', acRate: 65.7,
    tags: ['Array', 'Prefix Sum'],
    description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    defaultStdin: '1 2 3 4',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> productExceptSelf(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> ans(n, 1);\n    int prefix = 1;\n    for (int i = 0; i < n; i++) { ans[i] = prefix; prefix *= nums[i]; }\n    int suffix = 1;\n    for (int i = n - 1; i >= 0; i--) { ans[i] *= suffix; suffix *= nums[i]; }\n    return ans;\n}\n\nint main() {\n    vector<int> nums = {1,2,3,4};\n    auto res = productExceptSelf(nums);\n    for (int x : res) cout << x << " ";\n    cout << endl;\n    return 0;\n}`,
      python: `from typing import List\n\ndef productExceptSelf(nums: List[int]) -> List[int]:\n    n = len(nums)\n    ans = [1] * n\n    prefix = 1\n    for i in range(n):\n        ans[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        ans[i] *= suffix\n        suffix *= nums[i]\n    return ans\n\nprint(productExceptSelf([1, 2, 3, 4]))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] ans = new int[n];\n        Arrays.fill(ans, 1);\n        int prefix = 1;\n        for (int i = 0; i < n; i++) { ans[i] = prefix; prefix *= nums[i]; }\n        int suffix = 1;\n        for (int i = n - 1; i >= 0; i--) { ans[i] *= suffix; suffix *= nums[i]; }\n        return ans;\n    }\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(productExceptSelf(new int[]{1,2,3,4})));\n    }\n}`,
      javascript: `function productExceptSelf(nums) {\n    const n = nums.length, ans = new Array(n).fill(1);\n    let prefix = 1;\n    for (let i = 0; i < n; i++) { ans[i] = prefix; prefix *= nums[i]; }\n    let suffix = 1;\n    for (let i = n - 1; i >= 0; i--) { ans[i] *= suffix; suffix *= nums[i]; }\n    return ans;\n}\nconsole.log(productExceptSelf([1,2,3,4]));`,
    },
  },
  {
    id: 146, title: 'LRU Cache', topic: 'Design', difficulty: 'Medium', acRate: 42.3,
    tags: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'],
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.',
    examples: [{ input: '["LRUCache","put","put","get","put","get","put","get","get","get"]', output: '[null,null,null,1,null,-1,null,-1,3,4]' }],
    defaultStdin: 'capacity = 2',
    templates: {
      cpp: `#include <iostream>\n#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\n    int cap;\n    list<pair<int, int>> cache;\n    unordered_map<int, list<pair<int, int>>::iterator> map;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    \n    int get(int key) {\n        if (!map.count(key)) return -1;\n        cache.splice(cache.begin(), cache, map[key]);\n        return map[key]->second;\n    }\n    \n    void put(int key, int value) {\n        if (map.count(key)) {\n            cache.splice(cache.begin(), cache, map[key]);\n            map[key]->second = value;\n            return;\n        }\n        if (cache.size() == cap) {\n            map.erase(cache.back().first);\n            cache.pop_back();\n        }\n        cache.push_front({key, value});\n        map[key] = cache.begin();\n    }\n};\n\nint main() {\n    LRUCache lru(2);\n    lru.put(1, 1);\n    lru.put(2, 2);\n    cout << "Get 1: " << lru.get(1) << endl;\n    lru.put(3, 3);\n    cout << "Get 2: " << lru.get(2) << endl;\n    return 0;\n}`,
      python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cache = OrderedDict()\n        self.cap = capacity\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)\n\nlru = LRUCache(2)\nlru.put(1, 1)\nlru.put(2, 2)\nprint("Get 1:", lru.get(1))\nlru.put(3, 3)\nprint("Get 2:", lru.get(2))`,
      java: `import java.util.*;\n\nclass LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) { return super.getOrDefault(key, -1); }\n    public void put(int key, int value) { super.put(key, value); }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity;\n    }\n    public static void main(String[] args) {\n        LRUCache lru = new LRUCache(2);\n        lru.put(1, 1); lru.put(2, 2);\n        System.out.println("Get 1: " + lru.get(1));\n    }\n}`,
      javascript: `class LRUCache {\n    constructor(capacity) {\n        this.cap = capacity;\n        this.map = new Map();\n    }\n    get(key) {\n        if (!this.map.has(key)) return -1;\n        const val = this.map.get(key);\n        this.map.delete(key);\n        this.map.set(key, val);\n        return val;\n    }\n    put(key, value) {\n        if (this.map.has(key)) this.map.delete(key);\n        this.map.set(key, value);\n        if (this.map.size > this.cap)\n            this.map.delete(this.map.keys().next().value);\n    }\n}\nconst lru = new LRUCache(2);\nlru.put(1, 1); lru.put(2, 2);\nconsole.log("Get 1:", lru.get(1));`,
    },
  },
  {
    id: 322, title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'Medium', acRate: 43.7,
    tags: ['Array', 'Dynamic Programming', 'BFS'],
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.',
    examples: [
      { input: 'coins = [1,5,10,25], amount = 30', output: '2', explain: '25 + 5 = 30' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    defaultStdin: '1 5 10 25\n30',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (coin <= i) dp[i] = min(dp[i], dp[i - coin] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}\n\nint main() {\n    vector<int> coins = {1, 5, 10, 25};\n    cout << coinChange(coins, 30) << endl;\n    return 0;\n}`,
      python: `from typing import List\n\ndef coinChange(coins: List[int], amount: int) -> int:\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\n\nprint(coinChange([1, 5, 10, 25], 30))`,
      java: `public class Solution {\n    public static int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        java.util.Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++)\n            for (int coin : coins)\n                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n    public static void main(String[] args) {\n        System.out.println(coinChange(new int[]{1,5,10,25}, 30));\n    }\n}`,
      javascript: `function coinChange(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let i = 1; i <= amount; i++)\n        for (const coin of coins)\n            if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}\nconsole.log(coinChange([1,5,10,25], 30));`,
    },
  },
  {
    id: 424, title: 'Longest Repeating Character Replacement', topic: 'Sliding Window', difficulty: 'Medium', acRate: 53.8,
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: 'You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.',
    examples: [
      { input: 's = "ABAB", k = 2', output: '4', explain: 'Replace the two \'A\'s with two \'B\'s or vice versa.' },
      { input: 's = "AABABBA", k = 1', output: '4' },
    ],
    defaultStdin: 'ABAB\n2',
    templates: {
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint characterReplacement(string s, int k) {\n    unordered_map<char, int> count;\n    int left = 0, maxCount = 0, maxLen = 0;\n    for (int right = 0; right < s.size(); right++) {\n        maxCount = max(maxCount, ++count[s[right]]);\n        while ((right - left + 1) - maxCount > k)\n            count[s[left++]]--;\n        maxLen = max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\n\nint main() {\n    cout << characterReplacement("ABAB", 2) << endl;\n    return 0;\n}`,
      python: `def characterReplacement(s: str, k: int) -> int:\n    count = {}\n    left = max_count = max_len = 0\n    for right in range(len(s)):\n        count[s[right]] = count.get(s[right], 0) + 1\n        max_count = max(max_count, count[s[right]])\n        while (right - left + 1) - max_count > k:\n            count[s[left]] -= 1\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint(characterReplacement("ABAB", 2))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static int characterReplacement(String s, int k) {\n        Map<Character, Integer> count = new HashMap<>();\n        int left = 0, maxCount = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            maxCount = Math.max(maxCount, count.merge(s.charAt(right), 1, Integer::sum));\n            while ((right - left + 1) - maxCount > k)\n                count.merge(s.charAt(left++), -1, Integer::sum);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n    public static void main(String[] args) { System.out.println(characterReplacement("ABAB", 2)); }\n}`,
      javascript: `function characterReplacement(s, k) {\n    const count = {};\n    let left = 0, maxCount = 0, maxLen = 0;\n    for (let right = 0; right < s.length; right++) {\n        count[s[right]] = (count[s[right]] || 0) + 1;\n        maxCount = Math.max(maxCount, count[s[right]]);\n        while ((right - left + 1) - maxCount > k)\n            count[s[left++]]--;\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\nconsole.log(characterReplacement("ABAB", 2));`,
    },
  },
  {
    id: 572, title: 'Subtree of Another Tree', topic: 'Trees', difficulty: 'Easy', acRate: 47.3,
    tags: ['Tree', 'DFS', 'String Matching', 'Binary Tree', 'Hash Function'],
    description: 'Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of `subRoot` and `false` otherwise.\n\nA subtree of a binary tree `tree` is a tree that consists of a node in `tree` and all of this node\'s descendants. The tree `tree` could also be considered as a subtree of itself.',
    examples: [
      { input: 'root = [3,4,5,1,2], subRoot = [4,1,2]', output: 'true' },
      { input: 'root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]', output: 'false' },
    ],
    defaultStdin: '3 4 5\n4 1 2',
    templates: {
      cpp: `#include <iostream>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode* left; TreeNode* right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\n\nbool isSame(TreeNode* s, TreeNode* t) {\n    if (!s && !t) return true;\n    if (!s || !t) return false;\n    return s->val == t->val && isSame(s->left, t->left) && isSame(s->right, t->right);\n}\n\nbool isSubtree(TreeNode* root, TreeNode* subRoot) {\n    if (!root) return false;\n    if (isSame(root, subRoot)) return true;\n    return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);\n}\n\nint main() { cout << "Subtree solution ready" << endl; return 0; }`,
      python: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\ndef isSubtree(root, subRoot) -> bool:\n    def isSame(s, t):\n        if not s and not t: return True\n        if not s or not t: return False\n        return s.val == t.val and isSame(s.left, t.left) and isSame(s.right, t.right)\n    if not root: return False\n    if isSame(root, subRoot): return True\n    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)\n\nprint("Subtree solution ready")`,
      java: `public class Solution {\n    static class TreeNode { int val; TreeNode left, right; TreeNode(int x) { val = x; } }\n    public static boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        if (root == null) return false;\n        if (isSame(root, subRoot)) return true;\n        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n    }\n    private static boolean isSame(TreeNode s, TreeNode t) {\n        if (s == null && t == null) return true;\n        if (s == null || t == null) return false;\n        return s.val == t.val && isSame(s.left, t.left) && isSame(s.right, t.right);\n    }\n    public static void main(String[] args) { System.out.println("Subtree solution ready"); }\n}`,
      javascript: `function isSubtree(root, subRoot) {\n    function isSame(s, t) {\n        if (!s && !t) return true;\n        if (!s || !t) return false;\n        return s.val === t.val && isSame(s.left, t.left) && isSame(s.right, t.right);\n    }\n    if (!root) return false;\n    if (isSame(root, subRoot)) return true;\n    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n}\nconsole.log("Subtree of Another Tree ready");`,
    },
  },
];

/* ── Built-in HackerRank Problem Bank ───────────────────────────────── */
const HACKERRANK_PROBLEMS: Problem[] = [
  {
    id: 1001, title: 'Solve Me First', topic: 'Warmup', difficulty: 'Easy', points: 10, platform: 'hackerrank',
    tags: ['Algorithms', 'Warmup', 'HackerRank'],
    description: 'Complete the function `solveMeFirst` to compute the sum of two integers `a` and `b`.\n\nInput Format:\na = first integer\nb = second integer\n\nConstraints:\n1 <= a, b <= 1000',
    examples: [{ input: 'a = 2, b = 3', output: '5' }],
    defaultStdin: '2\n3',
    templates: {
      cpp: `#include <iostream>\nusing namespace std;\n\nint solveMeFirst(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int a, b;\n    if (cin >> a >> b) {\n        cout << solveMeFirst(a, b) << endl;\n    }\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    static int solveMeFirst(int a, int b) {\n        return a + b;\n    }\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int a = in.nextInt();\n        int b = in.nextInt();\n        System.out.println(solveMeFirst(a, b));\n    }\n}`,
      python: `def solveMeFirst(a: int, b: int) -> int:\n    return a + b\n\nnum1 = int(input())\nnum2 = int(input())\nprint(solveMeFirst(num1, num2))`,
      javascript: `function solveMeFirst(a, b) {\n    return a + b;\n}\nconsole.log(solveMeFirst(2, 3));`,
    }
  },
  {
    id: 1002, title: 'Simple Array Sum', topic: 'Warmup', difficulty: 'Easy', points: 10, platform: 'hackerrank',
    tags: ['Algorithms', 'Arrays', 'HackerRank'],
    description: 'Given an array of integers, find the sum of its elements.\n\nInput Format:\nFirst line contains integer n (size of array).\nSecond line contains n space-separated integers.',
    examples: [{ input: 'ar = [1, 2, 3, 4, 10, 11]', output: '31' }],
    defaultStdin: '6\n1 2 3 4 10 11',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint simpleArraySum(vector<int> ar) {\n    int sum = 0;\n    for (int x : ar) sum += x;\n    return sum;\n}\n\nint main() {\n    cout << simpleArraySum({1, 2, 3, 4, 10, 11}) << endl;\n    return 0;\n}`,
      python: `def simpleArraySum(ar):\n    return sum(ar)\n\nprint(simpleArraySum([1, 2, 3, 4, 10, 11]))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static int simpleArraySum(List<Integer> ar) {\n        int sum = 0;\n        for (int x : ar) sum += x;\n        return sum;\n    }\n    public static void main(String[] args) {\n        System.out.println(simpleArraySum(Arrays.asList(1, 2, 3, 4, 10, 11)));\n    }\n}`,
      javascript: `function simpleArraySum(ar) {\n    return ar.reduce((a, b) => a + b, 0);\n}\nconsole.log(simpleArraySum([1, 2, 3, 4, 10, 11]));`,
    }
  },
  {
    id: 1003, title: 'Compare the Triplets', topic: 'Warmup', difficulty: 'Easy', points: 15, platform: 'hackerrank',
    tags: ['Algorithms', 'Arrays', 'HackerRank'],
    description: 'Alice and Bob each created one problem for HackerRank. A reviewer rates the two challenges, awarding points from 1 to 100 for three categories: problem clarity, originality, and difficulty.\n\nCompare a[i] and b[i]:\n- If a[i] > b[i], Alice is awarded 1 point.\n- If a[i] < b[i], Bob is awarded 1 point.\n- If a[i] = b[i], neither person receives a point.',
    examples: [{ input: 'a = [5, 6, 7], b = [3, 6, 10]', output: '[1, 1]' }],
    defaultStdin: '5 6 7\n3 6 10',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> compareTriplets(vector<int> a, vector<int> b) {\n    int alice = 0, bob = 0;\n    for (int i = 0; i < 3; i++) {\n        if (a[i] > b[i]) alice++;\n        else if (a[i] < b[i]) bob++;\n    }\n    return {alice, bob};\n}\n\nint main() {\n    auto res = compareTriplets({5, 6, 7}, {3, 6, 10});\n    cout << res[0] << " " << res[1] << endl;\n    return 0;\n}`,
      python: `def compareTriplets(a, b):\n    alice = sum(1 for i in range(3) if a[i] > b[i])\n    bob = sum(1 for i in range(3) if a[i] < b[i])\n    return [alice, bob]\n\nprint(compareTriplets([5, 6, 7], [3, 6, 10]))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static List<Integer> compareTriplets(List<Integer> a, List<Integer> b) {\n        int alice = 0, bob = 0;\n        for (int i = 0; i < 3; i++) {\n            if (a.get(i) > b.get(i)) alice++;\n            else if (a.get(i) < b.get(i)) bob++;\n        }\n        return Arrays.asList(alice, bob);\n    }\n    public static void main(String[] args) {\n        System.out.println(compareTriplets(Arrays.asList(5,6,7), Arrays.asList(3,6,10)));\n    }\n}`,
      javascript: `function compareTriplets(a, b) {\n    let alice = 0, bob = 0;\n    for (let i = 0; i < 3; i++) {\n        if (a[i] > b[i]) alice++;\n        else if (a[i] < b[i]) bob++;\n    }\n    return [alice, bob];\n}\nconsole.log(compareTriplets([5,6,7], [3,6,10]));`,
    }
  },
  {
    id: 1004, title: 'Diagonal Difference', topic: 'Arrays & Matrices', difficulty: 'Easy', points: 15, platform: 'hackerrank',
    tags: ['Algorithms', 'Matrices', 'HackerRank'],
    description: 'Given a square matrix, calculate the absolute difference between the sums of its diagonals.\n\nExample:\n1 2 3\n4 5 6\n9 8 9\nPrimary diagonal = 1 + 5 + 9 = 15.\nSecondary diagonal = 3 + 5 + 9 = 17.\nAbsolute difference = |15 - 17| = 2.',
    examples: [{ input: 'matrix = [[11, 2, 4], [4, 5, 6], [10, 8, -12]]', output: '15' }],
    defaultStdin: '3\n11 2 4\n4 5 6\n10 8 -12',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <cmath>\nusing namespace std;\n\nint diagonalDifference(vector<vector<int>> arr) {\n    int d1 = 0, d2 = 0, n = arr.size();\n    for (int i = 0; i < n; i++) {\n        d1 += arr[i][i];\n        d2 += arr[i][n - 1 - i];\n    }\n    return abs(d1 - d2);\n}\n\nint main() {\n    vector<vector<int>> arr = {{11, 2, 4}, {4, 5, 6}, {10, 8, -12}};\n    cout << diagonalDifference(arr) << endl;\n    return 0;\n}`,
      python: `def diagonalDifference(arr):\n    n = len(arr)\n    d1 = sum(arr[i][i] for i in range(n))\n    d2 = sum(arr[i][n - 1 - i] for i in range(n))\n    return abs(d1 - d2)\n\nprint(diagonalDifference([[11, 2, 4], [4, 5, 6], [10, 8, -12]]))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static int diagonalDifference(List<List<Integer>> arr) {\n        int d1 = 0, d2 = 0, n = arr.size();\n        for (int i = 0; i < n; i++) {\n            d1 += arr.get(i).get(i);\n            d2 += arr.get(i).get(n - 1 - i);\n        }\n        return Math.abs(d1 - d2);\n    }\n    public static void main(String[] args) {\n        System.out.println("Diagonal Difference ready");\n    }\n}`,
      javascript: `function diagonalDifference(arr) {\n    let d1 = 0, d2 = 0, n = arr.length;\n    for (let i = 0; i < n; i++) {\n        d1 += arr[i][i];\n        d2 += arr[i][n - 1 - i];\n    }\n    return Math.abs(d1 - d2);\n}\nconsole.log(diagonalDifference([[11, 2, 4], [4, 5, 6], [10, 8, -12]]));`,
    }
  },
  {
    id: 1005, title: 'Sparse Arrays', topic: 'Data Structures', difficulty: 'Medium', points: 25, platform: 'hackerrank',
    tags: ['Data Structures', 'Strings', 'HackerRank'],
    description: 'There is a collection of input strings and a collection of query strings. For each query string, determine how many times it occurs in the list of input strings. Return an array of the results.',
    examples: [{ input: 'strings = ["aba","baba","aba","xzxb"], queries = ["aba","xzxb","ab"]', output: '[2, 1, 0]' }],
    defaultStdin: '4\naba\nbaba\naba\nxzxb\n3\naba\nxzxb\nab',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> matchingStrings(vector<string> stringList, vector<string> queries) {\n    unordered_map<string, int> freq;\n    for (const auto& s : stringList) freq[s]++;\n    vector<int> res;\n    for (const auto& q : queries) res.push_back(freq[q]);\n    return res;\n}\n\nint main() {\n    auto res = matchingStrings({"aba","baba","aba","xzxb"}, {"aba","xzxb","ab"});\n    for (int x : res) cout << x << " ";\n    cout << endl;\n    return 0;\n}`,
      python: `from collections import Counter\n\ndef matchingStrings(stringList, queries):\n    counts = Counter(stringList)\n    return [counts[q] for q in queries]\n\nprint(matchingStrings(["aba","baba","aba","xzxb"], ["aba","xzxb","ab"]))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static List<Integer> matchingStrings(List<String> stringList, List<String> queries) {\n        Map<String, Integer> map = new HashMap<>();\n        for (String s : stringList) map.put(s, map.getOrDefault(s, 0) + 1);\n        List<Integer> res = new ArrayList<>();\n        for (String q : queries) res.add(map.getOrDefault(q, 0));\n        return res;\n    }\n    public static void main(String[] args) {\n        System.out.println(matchingStrings(Arrays.asList("aba","baba","aba","xzxb"), Arrays.asList("aba","xzxb","ab")));\n    }\n}`,
      javascript: `function matchingStrings(stringList, queries) {\n    const map = new Map();\n    for (const s of stringList) map.set(s, (map.get(s) || 0) + 1);\n    return queries.map(q => map.get(q) || 0);\n}\nconsole.log(matchingStrings(["aba","baba","aba","xzxb"], ["aba","xzxb","ab"]));`,
    }
  }
];

const ALL_INITIAL_PROBLEMS: Problem[] = [
  ...BUILTIN_PROBLEMS.map(p => ({ ...p, platform: 'leetcode' as const })),
  ...HACKERRANK_PROBLEMS,
];

/* ── Study Plans ─────────────────────────────────────────────────────── */
const STUDY_PLANS = [
  {
    id: 'blind75', name: 'Blind 75', icon: '🎯', color: '#7c3aed',
    desc: '75 most important problems for FAANG interviews',
    problems: [1, 3, 15, 20, 21, 70, 104, 121, 146, 200, 206, 238, 322, 424, 572],
  },
  {
    id: 'neetcode150', name: 'NeetCode 150', icon: '🚀', color: '#0ea5e9',
    desc: 'Comprehensive 150-problem roadmap by NeetCode',
    problems: [1, 3, 15, 20, 21, 70, 104, 121, 146, 200, 206, 238, 322, 424, 572],
  },
  {
    id: 'grind75', name: 'Grind 75', icon: '⚡', color: '#f59e0b',
    desc: 'Updated Blind 75 with additional essential problems',
    problems: [1, 3, 20, 21, 70, 104, 121, 200, 206, 238],
  },
  {
    id: 'dynamic-programming', name: 'DP Mastery', icon: '🧠', color: '#10b981',
    desc: 'Dynamic programming problems from easy to hard',
    problems: [70, 121, 322],
  },
];

const LANG_OPTIONS = [
  { value: 'cpp', label: 'C++', monaco: 'cpp', icon: '⚙' },
  { value: 'java', label: 'Java', monaco: 'java', icon: '☕' },
  { value: 'python', label: 'Python', monaco: 'python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript', icon: '🌐' },
];

const TOPIC_FILTERS = ['All', 'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Design'];
const DIFF_FILTERS = ['All', 'Easy', 'Medium', 'Hard'];
const diffColor: Record<string, string> = { Easy: '#3ecf8e', Medium: '#f0a500', Hard: '#ff4d6d' };
const diffBg: Record<string, string> = { Easy: 'rgba(62,207,142,0.1)', Medium: 'rgba(240,165,0,0.1)', Hard: 'rgba(255,77,109,0.1)' };

/* ── LeetCode Live Browser Component ────────────────────────────────── */
function LeetCodeBrowser({ onImport }: { onImport: (slug: string) => void }) {
  const [lcProblems, setLcProblems] = useState<any[]>([]);
  const [lcTotal, setLcTotal] = useState(0);
  const [lcPage, setLcPage] = useState(0);
  const [lcDiff, setLcDiff] = useState('');
  const [lcSearch, setLcSearch] = useState('');
  const [lcLoading, setLcLoading] = useState(false);
  const [lcError, setLcError] = useState<string | null>(null);
  const PAGE_SIZE = 20;

  const fetchProblems = useCallback(async (page = 0, diff = '', search = '') => {
    setLcLoading(true);
    setLcError(null);
    try {
      const res = await fetch('/api/leetcode/problems-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skip: page * PAGE_SIZE, limit: PAGE_SIZE, difficulty: diff, searchKeyword: search }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setLcError(data.error || 'Failed to load from LeetCode');
      } else {
        setLcProblems(data.questions || []);
        setLcTotal(data.total || 0);
      }
    } catch (e: any) {
      setLcError(e.message || 'Network error');
    } finally {
      setLcLoading(false);
    }
  }, []);

  useEffect(() => { fetchProblems(0, lcDiff, lcSearch); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLcPage(0);
    fetchProblems(0, lcDiff, lcSearch);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
      {/* Search & Filter */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <input
          type="text"
          placeholder="🔍 Search 2500+ problems..."
          value={lcSearch}
          onChange={e => setLcSearch(e.target.value)}
          style={{ flex: 1, padding: '7px 12px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(124,58,237,0.25)', color: '#fff', fontSize: '11px', outline: 'none' }}
        />
        <select value={lcDiff} onChange={e => { setLcDiff(e.target.value); setLcPage(0); fetchProblems(0, e.target.value, lcSearch); }}
          style={{ padding: '7px 10px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-1)', fontSize: '11px', outline: 'none' }}>
          <option value="">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button type="submit" className="btn btn-violet btn-sm" disabled={lcLoading}>Go</button>
      </form>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'var(--text-3)', flexShrink: 0 }}>
        <span>📊 <strong style={{ color: 'var(--text-2)' }}>{lcTotal.toLocaleString()}</strong> problems</span>
        <span>· Page {lcPage + 1} of {Math.ceil(lcTotal / PAGE_SIZE)}</span>
      </div>

      {/* Problem list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {lcLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', border: '2px solid var(--violet)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Fetching from LeetCode...</span>
          </div>
        ) : lcError ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--red)', fontSize: '11px' }}>
            ⚠ {lcError}
            <br />
            <button className="btn btn-ghost btn-sm" onClick={() => fetchProblems(0, lcDiff, lcSearch)} style={{ marginTop: '8px', fontSize: '10px' }}>Retry</button>
          </div>
        ) : lcProblems.map((p) => (
          <div key={p.frontendQuestionId}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(124,58,237,0.3)'; (e.currentTarget as HTMLElement).style.background = 'var(--violet-soft)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.background = 'var(--black-3)'; }}>
            <span style={{ fontSize: '10px', color: 'var(--text-3)', minWidth: '28px', fontFamily: 'JetBrains Mono, monospace' }}>#{p.frontendQuestionId}</span>
            <span style={{ flex: 1, fontSize: '11px', fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
            {p.isPaidOnly && <span style={{ fontSize: '9px', color: '#f0a500', background: 'rgba(240,165,0,0.1)', padding: '2px 5px', borderRadius: '4px', flexShrink: 0 }}>PRO</span>}
            {p.acRate && <span style={{ fontSize: '9px', color: 'var(--text-3)', flexShrink: 0 }}>{p.acRate.toFixed(1)}%</span>}
            <span style={{ fontSize: '9px', fontWeight: 700, color: diffColor[p.difficulty] || '#fff', background: diffBg[p.difficulty] || 'transparent', padding: '2px 7px', borderRadius: '4px', flexShrink: 0 }}>{p.difficulty}</span>
            {!p.isPaidOnly && (
              <button className="btn btn-ghost btn-sm" onClick={() => onImport(p.titleSlug)}
                style={{ padding: '3px 8px', fontSize: '9px', flexShrink: 0 }}>Load →</button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!lcLoading && lcTotal > PAGE_SIZE && (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexShrink: 0 }}>
          <button className="btn btn-ghost btn-sm" disabled={lcPage === 0} onClick={() => { const p = lcPage - 1; setLcPage(p); fetchProblems(p, lcDiff, lcSearch); }} style={{ fontSize: '10px' }}>← Prev</button>
          <span style={{ fontSize: '10px', color: 'var(--text-3)', padding: '6px 10px' }}>{lcPage + 1} / {Math.ceil(lcTotal / PAGE_SIZE)}</span>
          <button className="btn btn-ghost btn-sm" disabled={(lcPage + 1) * PAGE_SIZE >= lcTotal} onClick={() => { const p = lcPage + 1; setLcPage(p); fetchProblems(p, lcDiff, lcSearch); }} style={{ fontSize: '10px' }}>Next →</button>
        </div>
      )}
    </div>
  );
}

/* ── Main Workspace Page ─────────────────────────────────────────────── */
export default function WorkspacePage() {
  const [problems, setProblems] = useState<Problem[]>(ALL_INITIAL_PROBLEMS);
  const [selectedProblem, setSelectedProblem] = useState<Problem>(ALL_INITIAL_PROBLEMS[0]);
  const [language, setLanguage] = useState(LANG_OPTIONS[0]);
  const [code, setCode] = useState(ALL_INITIAL_PROBLEMS[0].templates.cpp);
  const [customInput, setCustomInput] = useState(ALL_INITIAL_PROBLEMS[0].defaultStdin || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDiff, setSelectedDiff] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState<'All' | 'leetcode' | 'hackerrank'>('All');
  const [activeStudyPlan, setActiveStudyPlan] = useState<string | null>(null);
  const [solvedSet, setSolvedSet] = useState<Set<number>>(new Set());

  const [importQuery, setImportQuery] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const [lcUsername, setLcUsername] = useState('');
  const [lcUserStats, setLcUserStats] = useState<any>(null);
  const [isSyncingUser, setIsSyncingUser] = useState(false);

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [githubResult, setGithubResult] = useState<{ success: boolean; message: string; url?: string; path?: string } | null>(null);
  const [activeLeftTab, setActiveLeftTab] = useState<'statement' | 'bank' | 'leetcode-live' | 'study-plans' | 'sync'>('statement');

  const editorRef = useRef<any>(null);

  const handleProblemSelect = (p: Problem) => {
    setSelectedProblem(p);
    const tmpl = (p.templates as any)[language.value] ?? p.templates.cpp;
    setCode(tmpl);
    setCustomInput(p.defaultStdin || '');
    if (editorRef.current) editorRef.current.setValue(tmpl);
    setResult(null);
    setGithubResult(null);
    setActiveLeftTab('statement');
  };

  const handleLangChange = (val: string) => {
    const lang = LANG_OPTIONS.find(l => l.value === val)!;
    setLanguage(lang);
    const tmpl = (selectedProblem.templates as any)[val] ?? selectedProblem.templates.cpp;
    setCode(tmpl);
    if (editorRef.current) editorRef.current.setValue(tmpl);
    setResult(null);
  };

  const fetchLeetCodeProblem = async (slugOrQuery: string) => {
    if (!slugOrQuery.trim()) return;
    setIsImporting(true);
    setImportError(null);
    try {
      const res = await fetch('/api/leetcode/problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slugOrQuery }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setImportError(data.error || 'Failed to import problem');
        return;
      }
      const newProblem: Problem = { ...data, platform: 'leetcode' };
      setProblems(prev => [newProblem, ...prev.filter(p => p.id !== newProblem.id)]);
      handleProblemSelect(newProblem);
      setImportQuery('');
    } catch (err: any) {
      setImportError(err.message || 'Error communicating with LeetCode API');
    } finally {
      setIsImporting(false);
    }
  };

  const syncLeetCodeUser = async () => {
    if (!lcUsername.trim()) return;
    setIsSyncingUser(true);
    try {
      const res = await fetch('/api/leetcode/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: lcUsername }) });
      const data = await res.json();
      if (res.ok && !data.error) setLcUserStats(data);
    } catch (e) {} finally { setIsSyncingUser(false); }
  };

  const runCode = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() ?? code;
    setRunning(true); setResult(null); setGithubResult(null);
    try {
      const res = await fetch('/api/compile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: currentCode, language: language.value, stdin: customInput }) });
      setResult(await res.json());
    } catch (e: any) {
      setResult({ status: { id: 0, description: 'Network Error' }, stdout: null, stderr: e.message, compile_output: null, time: null, memory: null });
    }
    setRunning(false);
  }, [code, language, customInput]);

  const submitAndPush = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() ?? code;
    setSubmitting(true); setGithubResult(null);
    try {
      const compRes = await fetch('/api/compile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: currentCode, language: language.value, stdin: customInput }) });
      const compData: RunResult = await compRes.json();
      setResult(compData);
      if (compData.status?.id === 3) {
        setSolvedSet(prev => new Set([...prev, selectedProblem.id]));
      }
    } catch (e: any) {
      setResult({ status: { id: 0, description: 'Network Error' }, stdout: null, stderr: e.message, compile_output: null, time: null, memory: null });
    }
    try {
      const platformName = selectedProblem.platform || 'leetcode';
      const ghRes = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language: language.value,
          problemTitle: selectedProblem.title,
          topic: selectedProblem.topic,
          platform: platformName,
        }),
      });
      const ghData = await ghRes.json();
      setGithubResult(ghData);

      // Update LocalStorage pushes counter
      if (ghData.success) {
        try {
          const stats = JSON.parse(localStorage.getItem('nexusprep_stats') || '{}');
          stats.github_pushes = (stats.github_pushes || 85) + 1;
          localStorage.setItem('nexusprep_stats', JSON.stringify(stats));
        } catch (e) {}
      }
    } catch (e: any) {
      setGithubResult({ success: false, message: `GitHub push failed: ${e.message}` });
    }
    setSubmitting(false);
  }, [code, language, selectedProblem, customInput]);

  const studyPlanProblems = activeStudyPlan
    ? ALL_INITIAL_PROBLEMS.filter(p => STUDY_PLANS.find(sp => sp.id === activeStudyPlan)?.problems.includes(p.id))
    : ALL_INITIAL_PROBLEMS;

  const filteredProblems = (activeStudyPlan ? studyPlanProblems : problems).filter(p => {
    const matchSearch   = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTopic    = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchDiff     = selectedDiff === 'All' || p.difficulty === selectedDiff;
    const matchPlatform = selectedPlatform === 'All' || (p.platform || 'leetcode') === selectedPlatform;
    return matchSearch && matchTopic && matchDiff && matchPlatform;
  });

  const isAccepted = result?.status?.id === 3;
  const currentPlanInfo = STUDY_PLANS.find(sp => sp.id === activeStudyPlan);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h) - 44px)', gap: 0 }}>
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '14px', flexShrink: 0, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '18px' }}>
            ⌨ Code Workspace <span className="glow-text-violet">· LeetCode Hub</span>
          </h1>
          <p className="page-subtitle">2,500+ LeetCode problems · Judge0 sandbox · Auto GitHub push · Blind 75 study plans</p>
        </div>

        {/* Quick import bar */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: 'auto' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              id="lc-import-input"
              placeholder="Paste LeetCode URL or slug (e.g. two-sum)..."
              value={importQuery}
              onChange={e => setImportQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchLeetCodeProblem(importQuery)}
              style={{ width: '300px', padding: '7px 12px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(124,58,237,0.3)', color: '#fff', fontSize: '11px', outline: 'none' }}
            />
          </div>
          <button className="btn btn-violet btn-sm" onClick={() => fetchLeetCodeProblem(importQuery)} disabled={isImporting || !importQuery.trim()}>
            {isImporting ? '⟳ Loading...' : '⬇ Import'}
          </button>
        </div>

        {/* Language + actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select id="select-language" value={language.value} onChange={e => handleLangChange(e.target.value)}
            style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-1)', padding: '8px 14px', borderRadius: 'var(--r-pill)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
            {LANG_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.icon} {l.label}</option>)}
          </select>
          <button className="btn btn-ghost" onClick={runCode} disabled={running || submitting} style={{ gap: '6px' }} id="run-code-btn">
            {running ? '⟳ Running...' : '▶ Run Code'}
          </button>
          <button className="btn btn-violet" onClick={submitAndPush} disabled={running || submitting} id="submit-push-btn">
            {submitting ? '⟳ Submitting...' : '✓ Submit & Push'}
          </button>
        </div>
      </div>

      {importError && (
        <div style={{ padding: '8px 14px', marginBottom: '10px', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: 'var(--r-md)', color: 'var(--red)', fontSize: '11px' }}>
          ⚠ {importError}
        </div>
      )}

      {/* ── Main Split ──────────────────────────────────────────────── */}
      <div className="workspace-main-split">
        {/* LEFT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, overflow: 'hidden' }}>
          {/* Tab Bar */}
          <div style={{ display: 'flex', background: 'var(--black-3)', borderRadius: 'var(--r-pill)', padding: '3px', gap: '2px', flexShrink: 0, overflow: 'hidden' }}>
            {([
              { id: 'statement', label: '📄 Problem' },
              { id: 'bank', label: '📋 My Bank' },
              { id: 'leetcode-live', label: '🌐 Browse LC' },
              { id: 'study-plans', label: '🎯 Plans' },
              { id: 'sync', label: '📊 Profile' },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setActiveLeftTab(t.id)}
                style={{ flex: 1, padding: '5px 0', borderRadius: 'var(--r-pill)', fontSize: '9px', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: activeLeftTab === t.id ? 'var(--violet)' : 'transparent', color: activeLeftTab === t.id ? '#fff' : 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB: PROBLEM STATEMENT ── */}
          {activeLeftTab === 'statement' && (
            <div className="card" style={{ flex: 1, overflow: 'auto', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', color: diffColor[selectedProblem.difficulty], fontWeight: 700, background: diffBg[selectedProblem.difficulty], padding: '3px 10px', borderRadius: 'var(--r-pill)', border: `1px solid ${diffColor[selectedProblem.difficulty]}35` }}>
                  {selectedProblem.difficulty}
                </span>

                {selectedProblem.platform === 'hackerrank' ? (
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#3ecf8e', background: 'rgba(62,207,142,0.15)', padding: '3px 10px', borderRadius: 'var(--r-pill)', border: '1px solid rgba(62,207,142,0.3)' }}>
                    🟢 HackerRank · {selectedProblem.points ?? 10} pts
                  </span>
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#f0a500', background: 'rgba(240,165,0,0.15)', padding: '3px 10px', borderRadius: 'var(--r-pill)', border: '1px solid rgba(240,165,0,0.3)' }}>
                    🟡 LeetCode
                  </span>
                )}

                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>{selectedProblem.topic}</span>
                {selectedProblem.acRate && <span style={{ fontSize: '9px', color: 'var(--text-3)', marginLeft: 'auto' }}>✓ {selectedProblem.acRate}%</span>}
                {solvedSet.has(selectedProblem.id) && <span style={{ fontSize: '10px', color: 'var(--green)', background: 'rgba(62,207,142,0.1)', padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(62,207,142,0.2)' }}>✅ Solved</span>}
              </div>

              <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '10px', lineHeight: 1.3 }}>
                #{selectedProblem.id} {selectedProblem.title}
              </h2>

              {/* Tags */}
              {selectedProblem.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                  {selectedProblem.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '9px', color: 'var(--text-3)', background: 'var(--black-3)', padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.06)' }}>{tag}</span>
                  ))}
                </div>
              )}

              <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: '16px' }}>
                {selectedProblem.description}
              </p>

              {selectedProblem.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>Example {i + 1}:</div>
                  <div style={{ background: 'var(--black-3)', borderRadius: 'var(--r-md)', padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', borderLeft: '3px solid var(--violet)' }}>
                    <div><span style={{ color: 'var(--text-3)' }}>Input: </span><span style={{ color: 'var(--cyan)' }}>{ex.input}</span></div>
                    <div><span style={{ color: 'var(--text-3)' }}>Output: </span><span style={{ color: 'var(--green)' }}>{ex.output}</span></div>
                    {ex.explain && <div style={{ marginTop: '4px', color: 'var(--text-3)', fontSize: '10px' }}>Explanation: {ex.explain}</div>}
                  </div>
                </div>
              ))}

              {/* Execution Result */}
              {result && (
                <div style={{ marginTop: '16px', borderRadius: 'var(--r-md)', overflow: 'hidden', border: `1px solid ${isAccepted ? 'rgba(0,229,160,0.35)' : 'rgba(255,77,109,0.35)'}` }}>
                  <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', background: isAccepted ? 'rgba(0,229,160,0.08)' : 'rgba(255,77,109,0.08)' }}>
                    <span style={{ fontWeight: 700, fontSize: '12px', color: isAccepted ? 'var(--green)' : 'var(--red)' }}>
                      {isAccepted ? '✅' : '❌'} {result.status?.description ?? 'Executed'}
                    </span>
                    {result.time && <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>· {result.time}s</span>}
                    {result.memory && <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>· {Math.round(result.memory / 1024)}MB</span>}
                  </div>
                  {(result.stdout || result.stderr || result.compile_output) && (
                    <div style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', maxHeight: '140px', overflow: 'auto', background: '#0a0a0a' }}>
                      {result.compile_output && <div style={{ color: 'var(--amber)', marginBottom: '6px' }}><strong>Compiler:</strong><br />{result.compile_output}</div>}
                      {result.stderr && <div style={{ color: 'var(--red)', marginBottom: '6px' }}><strong>Error:</strong><br />{result.stderr}</div>}
                      {result.stdout && <div style={{ color: 'var(--green)' }}><strong>Output:</strong><br />{result.stdout}</div>}
                    </div>
                  )}
                </div>
              )}

              {githubResult && (
                <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: 'var(--r-md)', background: githubResult.success ? 'rgba(0,229,160,0.06)' : 'rgba(255,77,109,0.06)', border: `1px solid ${githubResult.success ? 'rgba(0,229,160,0.25)' : 'rgba(255,77,109,0.25)'}`, fontSize: '12px', color: githubResult.success ? 'var(--green)' : 'var(--red)' }}>
                  {githubResult.message}
                  {githubResult.url && <a href={githubResult.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '10px', color: 'var(--cyan)', marginTop: '4px' }}>🔗 View on GitHub →</a>}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: MY PROBLEM BANK ── */}
          {activeLeftTab === 'bank' && (
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px', overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '10px' }}>
                📋 Problem Bank <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 400 }}>({problems.length} problems · {solvedSet.size} solved)</span>
              </div>

              {/* Platform Switcher Buttons */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                <button
                  onClick={() => setSelectedPlatform('All')}
                  style={{
                    flex: 1, padding: '5px 8px', borderRadius: 'var(--r-md)', fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    background: selectedPlatform === 'All' ? 'var(--violet)' : 'var(--black-3)',
                    color: selectedPlatform === 'All' ? '#fff' : 'var(--text-3)', border: 'none'
                  }}
                >
                  All Platforms
                </button>
                <button
                  onClick={() => setSelectedPlatform('leetcode')}
                  style={{
                    flex: 1, padding: '5px 8px', borderRadius: 'var(--r-md)', fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    background: selectedPlatform === 'leetcode' ? '#f0a500' : 'var(--black-3)',
                    color: selectedPlatform === 'leetcode' ? '#000' : 'var(--text-3)', border: 'none'
                  }}
                >
                  🟡 LeetCode
                </button>
                <button
                  onClick={() => setSelectedPlatform('hackerrank')}
                  style={{
                    flex: 1, padding: '5px 8px', borderRadius: 'var(--r-md)', fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    background: selectedPlatform === 'hackerrank' ? '#3ecf8e' : 'var(--black-3)',
                    color: selectedPlatform === 'hackerrank' ? '#000' : 'var(--text-3)', border: 'none'
                  }}
                >
                  🟢 HackerRank
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', flexShrink: 0 }}>
                <input type="text" placeholder="Filter problems..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '7px 12px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '11px', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}
                    style={{ flex: 1, padding: '6px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-1)', fontSize: '10px', outline: 'none' }}>
                    {TOPIC_FILTERS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <select value={selectedDiff} onChange={e => setSelectedDiff(e.target.value)}
                    style={{ flex: 1, padding: '6px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-1)', fontSize: '10px', outline: 'none' }}>
                    {DIFF_FILTERS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filteredProblems.map(p => (
                  <div key={p.id} onClick={() => handleProblemSelect(p)}
                    style={{ padding: '9px 12px', borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'all 0.15s', background: selectedProblem.id === p.id ? 'var(--violet-soft)' : 'var(--black-3)', border: `1px solid ${selectedProblem.id === p.id ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.04)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, overflow: 'hidden' }}>
                        {solvedSet.has(p.id) && <span style={{ color: 'var(--green)', fontSize: '10px' }}>✓</span>}
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>#{p.id} {p.title}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
                        {p.platform === 'hackerrank' ? (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: '#3ecf8e', background: 'rgba(62,207,142,0.12)', padding: '1px 6px', borderRadius: '4px' }}>HackerRank</span>
                        ) : (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: '#f0a500', background: 'rgba(240,165,0,0.12)', padding: '1px 6px', borderRadius: '4px' }}>LeetCode</span>
                        )}
                        <span style={{ fontSize: '9px', fontWeight: 700, color: diffColor[p.difficulty], marginLeft: '2px' }}>{p.difficulty}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>{p.topic} {p.points ? `· ${p.points} pts` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ── TAB: BROWSE LEETCODE LIVE ── */}
          {activeLeftTab === 'leetcode-live' && (
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px', overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px' }}>
                🌐 Browse LeetCode Live <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 400 }}>· Real-time from leetcode.com</span>
              </div>
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <LeetCodeBrowser onImport={(slug) => { fetchLeetCodeProblem(slug); }} />
              </div>
            </div>
          )}

          {/* ── TAB: STUDY PLANS ── */}
          {activeLeftTab === 'study-plans' && (
            <div className="card" style={{ flex: 1, overflow: 'auto', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px' }}>
                🎯 Study Plans
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {STUDY_PLANS.map(plan => {
                  const planProblems = BUILTIN_PROBLEMS.filter(p => plan.problems.includes(p.id));
                  const solved = planProblems.filter(p => solvedSet.has(p.id)).length;
                  const progress = Math.round((solved / planProblems.length) * 100);
                  return (
                    <div key={plan.id}
                      style={{ padding: '12px', borderRadius: 'var(--r-md)', background: activeStudyPlan === plan.id ? 'rgba(124,58,237,0.1)' : 'var(--black-3)', border: `1px solid ${activeStudyPlan === plan.id ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => { setActiveStudyPlan(activeStudyPlan === plan.id ? null : plan.id); setActiveLeftTab('bank'); }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '18px' }}>{plan.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>{plan.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{plan.desc}</div>
                        </div>
                        <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>{solved}/{planProblems.length}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: plan.color, borderRadius: '100px', transition: 'width 0.5s ease' }} />
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-3)', marginTop: '4px' }}>{progress}% Complete</div>
                    </div>
                  );
                })}
              </div>

              {activeStudyPlan && currentPlanInfo && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>
                    {currentPlanInfo.icon} {currentPlanInfo.name} Problems
                  </div>
                  {BUILTIN_PROBLEMS.filter(p => currentPlanInfo.problems.includes(p.id)).map(p => (
                    <div key={p.id} onClick={() => handleProblemSelect(p)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', marginBottom: '4px', borderRadius: 'var(--r-md)', cursor: 'pointer', background: selectedProblem.id === p.id ? 'var(--violet-soft)' : 'transparent', border: `1px solid ${selectedProblem.id === p.id ? 'rgba(124,58,237,0.3)' : 'transparent'}`, transition: 'all 0.15s' }}>
                      <span style={{ fontSize: '12px' }}>{solvedSet.has(p.id) ? '✅' : '⬜'}</span>
                      <span style={{ flex: 1, fontSize: '11px', color: 'var(--text-2)' }}>#{p.id} {p.title}</span>
                      <span style={{ fontSize: '9px', color: diffColor[p.difficulty], fontWeight: 700 }}>{p.difficulty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: LEETCODE PROFILE SYNC ── */}
          {activeLeftTab === 'sync' && (
            <div className="card" style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '4px' }}>⚡ LeetCode Profile Sync</div>
              <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '14px' }}>Pull live stats, global ranking, and acceptance counts from your LeetCode profile.</p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input type="text" placeholder="Enter your LeetCode username..." value={lcUsername} onChange={e => setLcUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && syncLeetCodeUser()}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid var(--border)', color: '#fff', fontSize: '12px', outline: 'none' }} />
                <button className="btn btn-violet btn-sm" onClick={syncLeetCodeUser} disabled={isSyncingUser}>{isSyncingUser ? 'Syncing...' : 'Sync'}</button>
              </div>

              {lcUserStats && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px', background: 'var(--bg-card-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {lcUserStats.avatar && <img src={lcUserStats.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--violet)' }} />}
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{lcUserStats.username}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Global Rank #{lcUserStats.ranking?.toLocaleString()}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--violet)' }}>{lcUserStats.solved?.all}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-3)' }}>Total Solved</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { label: 'Easy', value: lcUserStats.solved?.easy, color: 'var(--green)', bg: 'rgba(62,207,142,0.1)', border: 'rgba(62,207,142,0.2)' },
                      { label: 'Medium', value: lcUserStats.solved?.medium, color: 'var(--amber)', bg: 'rgba(240,165,0,0.1)', border: 'rgba(240,165,0,0.2)' },
                      { label: 'Hard', value: lcUserStats.solved?.hard, color: 'var(--red)', bg: 'rgba(240,68,56,0.1)', border: 'rgba(240,68,56,0.2)' },
                    ].map(s => (
                      <div key={s.label} style={{ padding: '10px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-3)' }}>{s.label} Solved</div>
                      </div>
                    ))}
                  </div>

                  {/* Custom completion progress */}
                  <div style={{ padding: '12px', background: 'var(--black-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>📈 NexusPrep Progress</div>
                    {[
                      { label: 'Blind 75', total: 75, solved: solvedSet.size },
                      { label: 'Platform Problems', total: problems.length, solved: problems.filter(p => solvedSet.has(p.id)).length },
                    ].map(stat => (
                      <div key={stat.label} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-3)', marginBottom: '4px' }}>
                          <span>{stat.label}</span>
                          <span>{stat.solved}/{stat.total}</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '100px', height: '4px' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (stat.solved / stat.total) * 100)}%`, background: 'var(--violet)', borderRadius: '100px', transition: 'width 0.5s' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Monaco Editor */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor Header */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--cyan)', background: 'var(--cyan-soft)', padding: '3px 10px', borderRadius: '100px', border: '1px solid rgba(0,212,255,0.25)' }}>
              #{selectedProblem.id} {selectedProblem.title.toLowerCase().replace(/\s+/g, '-')}.{language.value === 'javascript' ? 'js' : language.value === 'python' ? 'py' : language.value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Monaco Editor · {language.label}</div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', fontSize: '10px', color: 'var(--text-3)' }}>
              <span>Ctrl+Enter to Run</span>
            </div>
          </div>

          {/* Monaco */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={language.monaco}
              value={code}
              theme="vs-dark"
              onChange={v => setCode(v ?? '')}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCode);
              }}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                padding: { top: 16 },
                automaticLayout: true,
                tabSize: 4,
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true },
                suggest: { showKeywords: true },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
