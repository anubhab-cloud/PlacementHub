'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Monaco must be dynamically imported (browser only)
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)', fontSize: '13px' }}>
      Loading Monaco Code Editor...
    </div>
  ),
});

/* ── Expanded LeetCode Question Bank (Blind 75 / NeetCode Favorites) ──────── */
export interface Problem {
  id: number;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string; explain?: string }[];
  defaultStdin: string;
  templates: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
}

const BUILTIN_PROBLEMS: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    topic: 'Arrays',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explain: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explain: '' },
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
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Sliding Window',
    difficulty: 'Medium',
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explain: 'The answer is "abc", with length of 3.' },
      { input: 's = "bbbbb"', output: '1', explain: 'The answer is "b", with length of 1.' },
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
    id: 15,
    title: '3Sum',
    topic: 'Two Pointers',
    difficulty: 'Medium',
    description: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.',
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explain: '' },
    ],
    defaultStdin: '-1 0 1 2 -1 -4',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> threeSum(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    vector<vector<int>> res;\n    for (int i = 0; i < nums.size(); i++) {\n        if (i > 0 && nums[i] == nums[i-1]) continue;\n        int l = i + 1, r = nums.size() - 1;\n        while (l < r) {\n            int sum = nums[i] + nums[l] + nums[r];\n            if (sum < 0) l++;\n            else if (sum > 0) r--;\n            else {\n                res.push_back({nums[i], nums[l], nums[r]});\n                while (l < r && nums[l] == nums[l+1]) l++;\n                while (l < r && nums[r] == nums[r-1]) r--;\n                l++; r--;\n            }\n        }\n    }\n    return res;\n}\n\nint main() {\n    vector<int> nums = {-1,0,1,2,-1,-4};\n    auto res = threeSum(nums);\n    cout << "Found " << res.size() << " triplets" << endl;\n    return 0;\n}`,
      python: `from typing import List\n\ndef threeSum(nums: List[int]) -> List[List[int]]:\n    nums.sort()\n    res = []\n    for i in range(len(nums)):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s < 0: l += 1\n            elif s > 0: r -= 1\n            else:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]: l += 1\n                while l < r and nums[r] == nums[r-1]: r -= 1\n                l += 1; r -= 1\n    return res\n\nprint(threeSum([-1,0,1,2,-1,-4]))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum < 0) l++;\n                else if (sum > 0) r--;\n                else {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                }\n            }\n        }\n        return res;\n    }\n    public static void main(String[] args) {\n        System.out.println(threeSum(new int[]{-1,0,1,2,-1,-4}));\n    }\n}`,
      javascript: `function threeSum(nums) {\n    nums.sort((a,b) => a-b);\n    const res = [];\n    for (let i = 0; i < nums.length; i++) {\n        if (i > 0 && nums[i] === nums[i-1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const sum = nums[i] + nums[l] + nums[r];\n            if (sum < 0) l++;\n            else if (sum > 0) r--;\n            else {\n                res.push([nums[i], nums[l], nums[r]]);\n                while (l < r && nums[l] === nums[l+1]) l++;\n                while (l < r && nums[r] === nums[r-1]) r--;\n                l++; r--;\n            }\n        }\n    }\n    return res;\n}\nconsole.log(threeSum([-1,0,1,2,-1,-4]));`,
    },
  },
  {
    id: 20,
    title: 'Valid Parentheses',
    topic: 'Stack',
    difficulty: 'Easy',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
    examples: [
      { input: 's = "()[]{}"', output: 'true', explain: '' },
      { input: 's = "(]"', output: 'false', explain: '' },
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
    id: 146,
    title: 'LRU Cache',
    topic: 'Design',
    difficulty: 'Medium',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class with `get(key)` and `put(key, value)` in `O(1)` time complexity.',
    examples: [
      { input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]', output: '[null, null, null, 1, null, -1, null, -1, 3, 4]', explain: '' },
    ],
    defaultStdin: 'capacity = 2',
    templates: {
      cpp: `#include <iostream>\n#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\n    int cap;\n    list<pair<int, int>> cache;\n    unordered_map<int, list<pair<int, int>>::iterator> map;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    \n    int get(int key) {\n        if (!map.count(key)) return -1;\n        cache.splice(cache.begin(), cache, map[key]);\n        return map[key]->second;\n    }\n    \n    void put(int key, int value) {\n        if (map.count(key)) {\n            cache.splice(cache.begin(), cache, map[key]);\n            map[key]->second = value;\n            return;\n        }\n        if (cache.size() == cap) {\n            map.erase(cache.back().first);\n            cache.pop_back();\n        }\n        cache.push_front({key, value});\n        map[key] = cache.begin();\n    }\n};\n\nint main() {\n    LRUCache lru(2);\n    lru.put(1, 1);\n    lru.put(2, 2);\n    cout << "LRU Get 1: " << lru.get(1) << endl;\n    return 0;\n}`,
      python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cache = OrderedDict()\n        self.cap = capacity\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)\n\nlru = LRUCache(2)\nlru.put(1, 1)\nlru.put(2, 2)\nprint("LRU Get 1:", lru.get(1))`,
      java: `import java.util.*;\n\nclass LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) {\n        return super.getOrDefault(key, -1);\n    }\n    public void put(int key, int value) {\n        super.put(key, value);\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity;\n    }\n    public static void main(String[] args) {\n        LRUCache lru = new LRUCache(2);\n        lru.put(1, 1);\n        System.out.println("LRU Cache initialized");\n    }\n}`,
      javascript: `class LRUCache {\n    constructor(capacity) {\n        this.cap = capacity;\n        this.map = new Map();\n    }\n    get(key) {\n        if (!this.map.has(key)) return -1;\n        const val = this.map.get(key);\n        this.map.delete(key);\n        this.map.set(key, val);\n        return val;\n    }\n    put(key, value) {\n        if (this.map.has(key)) this.map.delete(key);\n        this.map.set(key, value);\n        if (this.map.size > this.cap) {\n            this.map.delete(this.map.keys().next().value);\n        }\n    }\n}\nconst lru = new LRUCache(2);\nlru.put(1, 1);\nconsole.log(lru.get(1));`,
    },
  },
  {
    id: 200,
    title: 'Number of Islands',
    topic: 'Graphs',
    difficulty: 'Medium',
    description: 'Given an `m x n` 2D binary grid where `1` represents land and `0` represents water, return the number of islands.',
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explain: '' },
    ],
    defaultStdin: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid dfs(vector<vector<char>>& grid, int r, int c) {\n    int m = grid.size(), n = grid[0].size();\n    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] == '0') return;\n    grid[r][c] = '0';\n    dfs(grid, r+1, c);\n    dfs(grid, r-1, c);\n    dfs(grid, r, c+1);\n    dfs(grid, r, c-1);\n}\n\nint numIslands(vector<vector<char>>& grid) {\n    if (grid.empty()) return 0;\n    int count = 0;\n    for (int i = 0; i < grid.size(); i++) {\n        for (int j = 0; j < grid[0].size(); j++) {\n            if (grid[i][j] == '1') {\n                count++;\n                dfs(grid, i, j);\n            }\n        }\n    }\n    return count;\n}\n\nint main() {\n    vector<vector<char>> g = {{\'1\',\'1\',\'0\'}, {\'1\',\'1\',\'0\'}, {\'0\',\'0\',\'1\'}};\n    cout << "Islands count: " << numIslands(g) << endl;\n    return 0;\n}`,
      python: `from typing import List\n\ndef numIslands(grid: List[List[str]]) -> int:\n    if not grid: return 0\n    m, n = len(grid), len(grid[0])\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= m or c >= n or grid[r][c] == '0':\n            return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    \n    islands = 0\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == '1':\n                islands += 1\n                dfs(i, j)\n    return islands\n\nprint("Islands:", numIslands([['1','1','0'], ['1','0','0'], ['0','0','1']]))`,
      java: `public class Solution {\n    public static int numIslands(char[][] grid) {\n        if (grid == null || grid.length == 0) return 0;\n        int count = 0;\n        for (int i = 0; i < grid.length; i++) {\n            for (int j = 0; j < grid[0].length; j++) {\n                if (grid[i][j] == '1') {\n                    count++;\n                    dfs(grid, i, j);\n                }\n            }\n        }\n        return count;\n    }\n    private static void dfs(char[][] grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') return;\n        grid[r][c] = '0';\n        dfs(grid, r+1, c);\n        dfs(grid, r-1, c);\n        dfs(grid, r, c+1);\n        dfs(grid, r, c-1);\n    }\n    public static void main(String[] args) {\n        System.out.println("Islands algorithm executed");\n    }\n}`,
      javascript: `function numIslands(grid) {\n    let count = 0;\n    function dfs(r, c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === '0') return;\n        grid[r][c] = '0';\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);\n    }\n    for (let i = 0; i < grid.length; i++) {\n        for (let j = 0; j < grid[0].length; j++) {\n            if (grid[i][j] === '1') {\n                count++;\n                dfs(i, j);\n            }\n        }\n    }\n    return count;\n}\nconsole.log("Number of Islands calculated");`,
    },
  },
];

const LANG_OPTIONS = [
  { value: 'cpp', label: 'C++', monaco: 'cpp' },
  { value: 'java', label: 'Java', monaco: 'java' },
  { value: 'python', label: 'Python', monaco: 'python' },
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript' },
];

const TOPIC_FILTERS = ['All', 'Arrays', 'Two Pointers', 'Sliding Window', 'Stack', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Design'];
const DIFF_FILTERS = ['All', 'Easy', 'Medium', 'Hard'];

const diffColor: Record<string, string> = {
  Easy: 'var(--green)',
  Medium: 'var(--amber)',
  Hard: 'var(--red)',
};

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

export default function WorkspacePage() {
  const [problems, setProblems] = useState<Problem[]>(BUILTIN_PROBLEMS);
  const [selectedProblem, setSelectedProblem] = useState<Problem>(BUILTIN_PROBLEMS[0]);
  const [language, setLanguage] = useState(LANG_OPTIONS[0]);
  const [code, setCode] = useState(BUILTIN_PROBLEMS[0].templates.cpp);
  const [customInput, setCustomInput] = useState(BUILTIN_PROBLEMS[0].defaultStdin || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDiff, setSelectedDiff] = useState('All');

  // LeetCode live import state
  const [importQuery, setImportQuery] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // LeetCode sync user state
  const [lcUsername, setLcUsername] = useState('anubhab_dev');
  const [lcUserStats, setLcUserStats] = useState<any>(null);
  const [isSyncingUser, setIsSyncingUser] = useState(false);

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [githubResult, setGithubResult] = useState<{ success: boolean; message: string; url?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'statement' | 'problems' | 'stdin' | 'leetcode-sync'>('statement');

  const editorRef = useRef<any>(null);

  const handleProblemSelect = (p: Problem) => {
    setSelectedProblem(p);
    const tmpl = (p.templates as any)[language.value] ?? (p.templates as any).cpp;
    setCode(tmpl);
    setCustomInput(p.defaultStdin || '');
    if (editorRef.current) {
      editorRef.current.setValue(tmpl);
    }
    setResult(null);
    setGithubResult(null);
  };

  const handleLangChange = (val: string) => {
    const lang = LANG_OPTIONS.find((l) => l.value === val)!;
    setLanguage(lang);
    const tmpl = (selectedProblem.templates as any)[val] ?? (selectedProblem.templates as any).cpp;
    setCode(tmpl);
    if (editorRef.current) {
      editorRef.current.setValue(tmpl);
    }
    setResult(null);
  };

  // Fetch ANY LeetCode Question dynamically
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
        setImportError(data.error || 'Failed to import problem from LeetCode');
        setIsImporting(false);
        return;
      }

      const newProblem: Problem = data;
      setProblems((prev) => [newProblem, ...prev.filter((p) => p.id !== newProblem.id)]);
      handleProblemSelect(newProblem);
      setImportQuery('');
      setActiveTab('statement');
    } catch (err: any) {
      setImportError(err.message || 'Error communicating with LeetCode API');
    } finally {
      setIsImporting(false);
    }
  };

  // Sync LeetCode User Profile
  const syncLeetCodeUser = async () => {
    if (!lcUsername.trim()) return;
    setIsSyncingUser(true);
    try {
      const res = await fetch('/api/leetcode/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: lcUsername }),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setLcUserStats(data);
      }
    } catch (e) {
      // ignore error
    } finally {
      setIsSyncingUser(false);
    }
  };

  useEffect(() => {
    syncLeetCodeUser();
  }, []);

  const runCode = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() ?? code;
    setRunning(true);
    setResult(null);
    setGithubResult(null);
    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language: language.value,
          stdin: customInput,
        }),
      });
      const data: RunResult = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({
        status: { id: 0, description: 'Network Error' },
        stdout: null,
        stderr: e.message,
        compile_output: null,
        time: null,
        memory: null,
      });
    }
    setRunning(false);
  }, [code, language, customInput]);

  const submitAndPush = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() ?? code;
    setSubmitting(true);
    setGithubResult(null);

    try {
      const compRes = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: currentCode, language: language.value, stdin: customInput }),
      });
      const compData: RunResult = await compRes.json();
      setResult(compData);
    } catch (e: any) {
      setResult({ status: { id: 0, description: 'Network Error' }, stdout: null, stderr: e.message, compile_output: null, time: null, memory: null });
    }

    // Push to GitHub
    try {
      const ghRes = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language: language.value,
          problemTitle: selectedProblem.title,
          topic: selectedProblem.topic,
        }),
      });
      const ghData = await ghRes.json();
      setGithubResult(ghData);
    } catch (e: any) {
      setGithubResult({ success: false, message: `GitHub push failed: ${e.message}` });
    }
    setSubmitting(false);
  }, [code, language, selectedProblem, customInput]);

  const filteredProblems = problems.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchDiff = selectedDiff === 'All' || p.difficulty === selectedDiff;
    return matchSearch && matchTopic && matchDiff;
  });

  const isAccepted = result?.status?.id === 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h) - 44px)', gap: 0 }}>
      {/* ── Top Header Controls & LeetCode Search Bar ───────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 0 14px',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 className="page-title" style={{ fontSize: '18px' }}>
            ⌨ Code Workspace <span className="glow-text-violet">· LeetCode Hub</span>
          </h1>
          <p className="page-subtitle">2,500+ LeetCode problems sync · Judge0 sandbox execution · Auto GitHub push</p>
        </div>

        {/* LeetCode Direct Import Input */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: 'auto' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Paste LeetCode URL or slug (e.g. lru-cache)..."
              value={importQuery}
              onChange={(e) => setImportQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLeetCodeProblem(importQuery)}
              style={{
                width: '100%',
                padding: '7px 12px',
                borderRadius: 'var(--r-md)',
                background: 'var(--black-3)',
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#fff',
                fontSize: '11px',
                outline: 'none',
              }}
            />
          </div>
          <button
            className="btn btn-violet btn-sm"
            onClick={() => fetchLeetCodeProblem(importQuery)}
            disabled={isImporting || !importQuery.trim()}
          >
            {isImporting ? 'Importing...' : 'Fetch LeetCode'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            id="select-language"
            value={language.value}
            onChange={(e) => handleLangChange(e.target.value)}
            style={{
              background: 'var(--black-2)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-1)',
              padding: '8px 14px',
              borderRadius: 'var(--r-pill)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {LANG_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>

          <button
            className="btn btn-ghost"
            onClick={runCode}
            disabled={running || submitting}
            style={{ gap: '6px' }}
          >
            {running ? 'Running...' : '▶ Run Code'}
          </button>

          <button className="btn btn-violet" onClick={submitAndPush} disabled={running || submitting}>
            {submitting ? 'Submitting...' : '✓ Submit & Push'}
          </button>
        </div>
      </div>

      {importError && (
        <div
          style={{
            padding: '8px 14px',
            marginBottom: '10px',
            background: 'rgba(255,77,109,0.1)',
            border: '1px solid rgba(255,77,109,0.3)',
            borderRadius: 'var(--r-md)',
            color: 'var(--red)',
            fontSize: '11px',
          }}
        >
          ⚠️ {importError}
        </div>
      )}

      {/* ── Main Split Container ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr', gap: '16px', minHeight: 0 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'var(--black-3)',
              borderRadius: 'var(--r-pill)',
              padding: '3px',
              gap: '3px',
              flexShrink: 0,
            }}
          >
            {(['statement', 'problems', 'stdin', 'leetcode-sync'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: 'var(--r-pill)',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s',
                  background: activeTab === t ? 'var(--violet)' : 'transparent',
                  color: activeTab === t ? '#fff' : 'var(--text-3)',
                }}
              >
                {t === 'statement'
                  ? '📄 Problem'
                  : t === 'problems'
                  ? '📋 LeetCode Bank'
                  : t === 'stdin'
                  ? '📥 Custom Stdin'
                  : '📊 LC Sync'}
              </button>
            ))}
          </div>

          {/* TAB: LEETCODE SYNC */}
          {activeTab === 'leetcode-sync' ? (
            <div className="card" style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '4px' }}>
                ⚡ Sync Official LeetCode Account
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '14px' }}>
                Pull live solved statistics, global ranking, and acceptance counts from your LeetCode profile.
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="LeetCode Username..."
                  value={lcUsername}
                  onChange={(e) => setLcUsername(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--r-md)',
                    background: 'var(--black-3)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <button className="btn btn-violet btn-sm" onClick={syncLeetCodeUser} disabled={isSyncingUser}>
                  {isSyncingUser ? 'Syncing...' : 'Sync Profile'}
                </button>
              </div>

              {lcUserStats && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      padding: '12px',
                      background: 'var(--bg-card-2)',
                      borderRadius: 'var(--r-md)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {lcUserStats.avatar && (
                      <img
                        src={lcUserStats.avatar}
                        alt="LeetCode Avatar"
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                    )}
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{lcUserStats.username}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                        Global Ranking: #{lcUserStats.ranking}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div
                      style={{
                        padding: '10px',
                        background: 'rgba(62,207,142,0.1)',
                        border: '1px solid rgba(62,207,142,0.2)',
                        borderRadius: 'var(--r-md)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--green)' }}>
                        {lcUserStats.solved.easy}
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-3)' }}>Easy Solved</div>
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        background: 'rgba(240,165,0,0.1)',
                        border: '1px solid rgba(240,165,0,0.2)',
                        borderRadius: 'var(--r-md)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--amber)' }}>
                        {lcUserStats.solved.medium}
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-3)' }}>Medium Solved</div>
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        background: 'rgba(240,68,56,0.1)',
                        border: '1px solid rgba(240,68,56,0.2)',
                        borderRadius: 'var(--r-md)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--red)' }}>
                        {lcUserStats.solved.hard}
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-3)' }}>Hard Solved</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'problems' ? (
            /* TAB: LEETCODE BANK */
            <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Filter problem title or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--r-md)',
                    background: 'var(--black-3)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '11px',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--black-3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-1)',
                      fontSize: '10px',
                      outline: 'none',
                    }}
                  >
                    {TOPIC_FILTERS.map((tf) => (
                      <option key={tf} value={tf}>
                        Topic: {tf}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedDiff}
                    onChange={(e) => setSelectedDiff(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--black-3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-1)',
                      fontSize: '10px',
                      outline: 'none',
                    }}
                  >
                    {DIFF_FILTERS.map((df) => (
                      <option key={df} value={df}>
                        Diff: {df}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Problem List */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredProblems.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      handleProblemSelect(p);
                      setActiveTab('statement');
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--r-md)',
                      cursor: 'pointer',
                      marginBottom: '6px',
                      transition: 'all 0.15s',
                      background: selectedProblem.id === p.id ? 'var(--violet-soft)' : 'var(--black-3)',
                      border: `1px solid ${
                        selectedProblem.id === p.id ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.04)'
                      }`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)' }}>
                        #{p.id} {p.title}
                      </span>
                      <span style={{ fontSize: '10px', color: diffColor[p.difficulty], fontWeight: 700 }}>
                        {p.difficulty}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{p.topic}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'stdin' ? (
            /* TAB: CUSTOM STDIN */
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-1)' }}>
                📥 Standard Input (stdin)
              </div>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter input here..."
                style={{
                  flex: 1,
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--r-md)',
                  background: 'var(--black-3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--green)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>
          ) : (
            /* TAB: PROBLEM STATEMENT & RESULTS */
            <div className="card" style={{ flex: 1, overflow: 'auto', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    color: diffColor[selectedProblem.difficulty],
                    fontWeight: 700,
                    background: `${diffColor[selectedProblem.difficulty]}18`,
                    padding: '3px 10px',
                    borderRadius: 'var(--r-pill)',
                    border: `1px solid ${diffColor[selectedProblem.difficulty]}35`,
                  }}
                >
                  {selectedProblem.difficulty}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>{selectedProblem.topic}</span>
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>
                #{selectedProblem.id} {selectedProblem.title}
              </h2>

              <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.75, whiteSpace: 'pre-line', marginBottom: '16px' }}>
                {selectedProblem.description}
              </p>

              {/* Examples */}
              {selectedProblem.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>
                    Example {i + 1}:
                  </div>
                  <div
                    style={{
                      background: 'var(--black-3)',
                      borderRadius: 'var(--r-md)',
                      padding: '10px 14px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-3)' }}>Input: </span>
                      <span style={{ color: 'var(--cyan)' }}>{ex.input}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-3)' }}>Output: </span>
                      <span style={{ color: 'var(--green)' }}>{ex.output}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Execution Result Box */}
              {result && (
                <div
                  style={{
                    marginTop: '16px',
                    borderRadius: 'var(--r-md)',
                    overflow: 'hidden',
                    border: `1px solid ${isAccepted ? 'rgba(0,229,160,0.35)' : 'rgba(255,77,109,0.35)'}`,
                  }}
                >
                  <div
                    style={{
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isAccepted ? 'rgba(0,229,160,0.08)' : 'rgba(255,77,109,0.08)',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '12px', color: isAccepted ? 'var(--green)' : 'var(--red)' }}>
                      {isAccepted ? '✅' : '❌'} {result.status?.description ?? 'Executed'}
                    </span>
                  </div>

                  {(result.stdout || result.stderr || result.compile_output) && (
                    <div
                      style={{
                        padding: '12px 14px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        maxHeight: '140px',
                        overflow: 'auto',
                        background: '#0a0a0a',
                      }}
                    >
                      {result.compile_output && (
                        <div style={{ color: 'var(--amber)', marginBottom: '6px' }}>
                          <strong>Compiler Message:</strong>
                          <br />
                          {result.compile_output}
                        </div>
                      )}
                      {result.stderr && (
                        <div style={{ color: 'var(--red)', marginBottom: '6px' }}>
                          <strong>Error Output:</strong>
                          <br />
                          {result.stderr}
                        </div>
                      )}
                      {result.stdout && (
                        <div style={{ color: 'var(--green)' }}>
                          <strong>Standard Output:</strong>
                          <br />
                          {result.stdout}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* GitHub Push Result */}
              {githubResult && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--r-md)',
                    background: githubResult.success ? 'rgba(0,229,160,0.06)' : 'rgba(255,77,109,0.06)',
                    border: `1px solid ${githubResult.success ? 'rgba(0,229,160,0.25)' : 'rgba(255,77,109,0.25)'}`,
                    fontSize: '12px',
                    color: githubResult.success ? 'var(--green)' : 'var(--red)',
                  }}
                >
                  {githubResult.message}
                  {githubResult.url && (
                    <a
                      href={githubResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', fontSize: '10px', color: 'var(--cyan)', marginTop: '4px' }}
                    >
                      🔗 View solution on GitHub →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Monaco Editor */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--cyan)',
                background: 'var(--cyan-soft)',
                padding: '3px 10px',
                borderRadius: '100px',
                border: '1px solid rgba(0,212,255,0.25)',
              }}
            >
              #{selectedProblem.id} {selectedProblem.title.toLowerCase().replace(/\s+/g, '-')}.
              {language.value === 'javascript' ? 'js' : language.value === 'python' ? 'py' : language.value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Monaco Editor · {language.label}</div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={language.monaco}
              value={code}
              theme="vs-dark"
              onChange={(v) => setCode(v ?? '')}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                  runCode();
                });
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
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
