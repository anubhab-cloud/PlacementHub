'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Monaco must be dynamically imported (browser only)
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)', fontSize: '13px' }}>
      Loading Monaco Editor...
    </div>
  ),
});

/* ── Extended Problem Bank ─────────────────────────────────────────────────── */
const PROBLEMS = [
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
    id: 2,
    title: 'Reverse Linked List',
    topic: 'Linked Lists',
    difficulty: 'Easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explain: '' },
    ],
    defaultStdin: '1 2 3 4 5',
    templates: {
      cpp: `#include <iostream>\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* nxt = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}\n\nint main() {\n    ListNode* head = new ListNode(1);\n    head->next = new ListNode(2);\n    head->next->next = new ListNode(3);\n    ListNode* res = reverseList(head);\n    while (res) {\n        cout << res->val << " ";\n        res = res->next;\n    }\n    return 0;\n}`,
      python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head: ListNode) -> ListNode:\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n\nhead = ListNode(1, ListNode(2, ListNode(3)))\nres = reverseList(head)\nwhile res:\n    print(res.val, end=" ")\n    res = res.next\nprint()`,
      java: `class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int x) { val = x; }\n}\n\npublic class Solution {\n    public static ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode nxt = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nxt;\n        }\n        return prev;\n    }\n    public static void main(String[] args) {\n        ListNode h = new ListNode(1);\n        h.next = new ListNode(2);\n        System.out.println("Reversed successfully");\n    }\n}`,
      javascript: `function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        let nxt = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}\nconsole.log("Linked List Reversed");`,
    },
  },
  {
    id: 3,
    title: 'Maximum Subarray',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nThis is solved using Kadane's Algorithm.",
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explain: 'Subarray [4,-1,2,1] has the largest sum = 6' },
    ],
    defaultStdin: '-2 1 -3 4 -1 2 1 -5 4',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    int maxSum = nums[0], currSum = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        currSum = max(nums[i], currSum + nums[i]);\n        maxSum = max(maxSum, currSum);\n    }\n    return maxSum;\n}\n\nint main() {\n    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};\n    cout << "Max Subarray Sum: " << maxSubArray(nums) << endl;\n    return 0;\n}`,
      python: `from typing import List\n\ndef maxSubArray(nums: List[int]) -> int:\n    max_sum = curr_sum = nums[0]\n    for n in nums[1:]:\n        curr_sum = max(n, curr_sum + n)\n        max_sum = max(max_sum, curr_sum)\n    return max_sum\n\nprint("Max Subarray Sum:", maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))`,
      java: `public class Solution {\n    public static int maxSubArray(int[] nums) {\n        int maxSum = nums[0], curr = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            curr = Math.max(nums[i], curr + nums[i]);\n            maxSum = Math.max(maxSum, curr);\n        }\n        return maxSum;\n    }\n    public static void main(String[] args) {\n        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));\n    }\n}`,
      javascript: `function maxSubArray(nums) {\n    let maxSum = nums[0], curr = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        maxSum = Math.max(maxSum, curr);\n    }\n    return maxSum;\n}\nconsole.log("Max Subarray:", maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`,
    },
  },
  {
    id: 4,
    title: 'Valid Anagram',
    topic: 'Strings',
    difficulty: 'Easy',
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.',
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true', explain: '' },
      { input: 's = "rat", t = "car"', output: 'false', explain: '' },
    ],
    defaultStdin: 'anagram\nnagaram',
    templates: {
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    if (s.length() != t.length()) return false;\n    int counts[26] = {0};\n    for (int i = 0; i < s.length(); i++) {\n        counts[s[i] - 'a']++;\n        counts[t[i] - 'a']--;\n    }\n    for (int c : counts) if (c != 0) return false;\n    return true;\n}\n\nint main() {\n    cout << (isAnagram("anagram", "nagaram") ? "true" : "false") << endl;\n    return 0;\n}`,
      python: `def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t): return False\n    counts = {}\n    for char in s:\n        counts[char] = counts.get(char, 0) + 1\n    for char in t:\n        if char not in counts or counts[char] == 0:\n            return False\n        counts[char] -= 1\n    return True\n\nprint(isAnagram("anagram", "nagaram"))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] counts = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            counts[s.charAt(i) - 'a']++;\n            counts[t.charAt(i) - 'a']--;\n        }\n        for (int c : counts) if (c != 0) return false;\n        return true;\n    }\n    public static void main(String[] args) {\n        System.out.println(isAnagram("anagram", "nagaram"));\n    }\n}`,
      javascript: `function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const map = {};\n    for (let char of s) map[char] = (map[char] || 0) + 1;\n    for (let char of t) {\n        if (!map[char]) return false;\n        map[char]--;\n    }\n    return true;\n}\nconsole.log(isAnagram("anagram", "nagaram"));`,
    },
  },
  {
    id: 5,
    title: 'Container With Most Water',
    topic: 'Arrays',
    difficulty: 'Medium',
    description: 'Given `n` non-negative integers representing heights, find two lines that together with the x-axis form a container containing the most water.',
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explain: '' },
    ],
    defaultStdin: '1 8 6 2 5 4 8 3 7',
    templates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxArea(vector<int>& height) {\n    int left = 0, right = height.size() - 1;\n    int maxW = 0;\n    while (left < right) {\n        int h = min(height[left], height[right]);\n        maxW = max(maxW, h * (right - left));\n        if (height[left] < height[right]) left++;\n        else right--;\n    }\n    return maxW;\n}\n\nint main() {\n    vector<int> h = {1,8,6,2,5,4,8,3,7};\n    cout << "Max Water Area: " << maxArea(h) << endl;\n    return 0;\n}`,
      python: `from typing import List\n\ndef maxArea(height: List[int]) -> int:\n    l, r = 0, len(height) - 1\n    max_area = 0\n    while l < r:\n        h = min(height[l], height[r])\n        max_area = max(max_area, h * (r - l))\n        if height[l] < height[r]:\n            l += 1\n        else:\n            r -= 1\n    return max_area\n\nprint("Max Area:", maxArea([1,8,6,2,5,4,8,3,7]))`,
      java: `public class Solution {\n    public static int maxArea(int[] height) {\n        int left = 0, right = height.length - 1;\n        int maxArea = 0;\n        while (left < right) {\n            int h = Math.min(height[left], height[right]);\n            maxArea = Math.max(maxArea, h * (right - left));\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return maxArea;\n    }\n    public static void main(String[] args) {\n        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7}));\n    }\n}`,
      javascript: `function maxArea(height) {\n    let l = 0, r = height.length - 1, maxW = 0;\n    while (l < r) {\n        let h = Math.min(height[l], height[r]);\n        maxW = Math.max(maxW, h * (r - l));\n        if (height[l] < height[r]) l++; else r--;\n    }\n    return maxW;\n}\nconsole.log(maxArea([1,8,6,2,5,4,8,3,7]));`,
    },
  },
  {
    id: 6,
    title: 'Invert Binary Tree',
    topic: 'Trees',
    difficulty: 'Easy',
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explain: '' },
    ],
    defaultStdin: '4 2 7 1 3 6 9',
    templates: {
      cpp: `#include <iostream>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* invertTree(TreeNode* root) {\n    if (!root) return nullptr;\n    TreeNode* temp = root->left;\n    root->left = invertTree(root->right);\n    root->right = invertTree(temp);\n    return root;\n}\n\nint main() {\n    TreeNode* root = new TreeNode(4);\n    root->left = new TreeNode(2);\n    root->right = new TreeNode(7);\n    invertTree(root);\n    cout << "Tree inverted successfully" << endl;\n    return 0;\n}`,
      python: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef invertTree(root: TreeNode) -> TreeNode:\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root\n\nroot = TreeNode(4, TreeNode(2), TreeNode(7))\ninvertTree(root)\nprint("Tree Inverted")`,
      java: `class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int x) { val = x; }\n}\n\npublic class Solution {\n    public static TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left;\n        root.left = invertTree(root.right);\n        root.right = invertTree(temp);\n        return root;\n    }\n    public static void main(String[] args) {\n        System.out.println("Binary tree inverted");\n    }\n}`,
      javascript: `function invertTree(root) {\n    if (!root) return null;\n    let temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}\nconsole.log("Tree inverted");`,
    },
  },
  {
    id: 7,
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
  { value: 'cpp',        label: 'C++',        monaco: 'cpp' },
  { value: 'java',       label: 'Java',       monaco: 'java' },
  { value: 'python',     label: 'Python',     monaco: 'python' },
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript' },
];

const TOPIC_FILTERS = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'];
const DIFF_FILTERS = ['All', 'Easy', 'Medium', 'Hard'];

const diffColor: Record<string, string> = {
  Easy:   'var(--green)',
  Medium: 'var(--amber)',
  Hard:   'var(--red)',
};

type RunResult = {
  status:         { id: number; description: string };
  stdout:         string | null;
  stderr:         string | null;
  compile_output: string | null;
  time:           string | null;
  memory:         number | null;
  engine?:        string;
  demo?:          boolean;
  message?:       string;
  error?:         string;
};

export default function WorkspacePage() {
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [language, setLanguage]               = useState(LANG_OPTIONS[0]);
  const [code, setCode]                       = useState(PROBLEMS[0].templates.cpp);
  const [customInput, setCustomInput]         = useState(PROBLEMS[0].defaultStdin || '');
  const [searchQuery, setSearchQuery]         = useState('');
  const [selectedTopic, setSelectedTopic]     = useState('All');
  const [selectedDiff, setSelectedDiff]       = useState('All');

  const [running, setRunning]                 = useState(false);
  const [submitting, setSubmitting]           = useState(false);
  const [result, setResult]                   = useState<RunResult | null>(null);
  const [githubResult, setGithubResult]       = useState<{ success: boolean; message: string; url?: string } | null>(null);
  const [activeTab, setActiveTab]             = useState<'statement'|'problems'|'stdin'>('statement');

  const editorRef = useRef<any>(null);

  // Sync editor content when problem or language changes
  const handleProblemSelect = (p: typeof PROBLEMS[0]) => {
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
    const lang = LANG_OPTIONS.find(l => l.value === val)!;
    setLanguage(lang);
    const tmpl = (selectedProblem.templates as any)[val] ?? (selectedProblem.templates as any).cpp;
    setCode(tmpl);
    if (editorRef.current) {
      editorRef.current.setValue(tmpl);
    }
    setResult(null);
  };

  const runCode = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() ?? code;
    setRunning(true);
    setResult(null);
    setGithubResult(null);
    try {
      const res = await fetch('/api/compile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
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

    // First compile check
    try {
      const compRes = await fetch('/api/compile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code: currentCode, language: language.value, stdin: customInput }),
      });
      const compData: RunResult = await compRes.json();
      setResult(compData);
      
      const compileOk = compData.status?.id === 3; // 3 = Accepted
      if (!compileOk && !compData.demo) {
        setGithubResult({ success: false, message: '❌ Fix execution errors before pushing to GitHub.' });
        setSubmitting(false);
        return;
      }
    } catch (e: any) {
      setResult({ status: { id: 0, description: 'Network Error' }, stdout: null, stderr: e.message, compile_output: null, time: null, memory: null });
      setSubmitting(false);
      return;
    }

    // Then push to GitHub
    try {
      const ghRes = await fetch('/api/github/push', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          code:         currentCode,
          language:     language.value,
          problemTitle: selectedProblem.title,
          topic:        selectedProblem.topic,
        }),
      });
      const ghData = await ghRes.json();
      setGithubResult(ghData);
    } catch (e: any) {
      setGithubResult({ success: false, message: `GitHub push failed: ${e.message}` });
    }
    setSubmitting(false);
  }, [code, language, selectedProblem, customInput]);

  // Filter problems by topic, difficulty, search
  const filteredProblems = PROBLEMS.filter(p => {
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTopic  = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchDiff   = selectedDiff === 'All' || p.difficulty === selectedDiff;
    return matchSearch && matchTopic && matchDiff;
  });

  const isAccepted = result?.status?.id === 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h) - 44px)', gap: 0 }}>

      {/* ── Header Controls ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '0 0 14px', flexShrink: 0, flexWrap: 'wrap',
      }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '18px' }}>⌨ Code Workspace</h1>
          <p className="page-subtitle">Monaco Editor · Judge0 & Wandbox Execution · Auto GitHub Push</p>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Language selector */}
          <select
            id="select-language"
            value={language.value}
            onChange={e => handleLangChange(e.target.value)}
            style={{
              background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-1)', padding: '8px 14px',
              borderRadius: 'var(--r-pill)', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', outline: 'none',
            }}
          >
            {LANG_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>

          <button
            className="btn btn-ghost"
            id="btn-run-code"
            onClick={runCode}
            disabled={running || submitting}
            style={{ gap: '6px' }}
            title="Shortcut: Ctrl+Enter"
          >
            {running ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>↻</span> Running...</> : '▶ Run Code (Ctrl+Enter)'}
          </button>

          <button
            className="btn btn-violet"
            id="btn-submit-push"
            onClick={submitAndPush}
            disabled={running || submitting}
          >
            {submitting ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>↻</span> Submitting...</> : '✓ Submit & Push to GitHub'}
          </button>
        </div>
      </div>

      {/* ── Main Split Container ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '400px 1fr', gap: '16px', minHeight: 0 }}>

        {/* Left Column: Navigation / Problem View / Stdin */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex', background: 'var(--black-3)', borderRadius: 'var(--r-pill)',
            padding: '3px', gap: '3px', flexShrink: 0,
          }}>
            {(['statement', 'problems', 'stdin'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1, padding: '6px 0', borderRadius: 'var(--r-pill)',
                  fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  border: 'none', transition: 'all 0.2s',
                  background: activeTab === t ? 'var(--violet)' : 'transparent',
                  color: activeTab === t ? '#fff' : 'var(--text-3)',
                }}
              >
                {t === 'statement' ? '📄 Problem' : t === 'problems' ? '📋 Problem Bank' : '📥 Custom Input'}
              </button>
            ))}
          </div>

          {/* TAB 1: ALL PROBLEMS LIST */}
          {activeTab === 'problems' ? (
            <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '14px' }}>
              {/* Filters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Search problem title or topic..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 'var(--r-md)',
                    background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff', fontSize: '11px', outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    value={selectedTopic}
                    onChange={e => setSelectedTopic(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-1)', fontSize: '10px', outline: 'none' }}
                  >
                    {TOPIC_FILTERS.map(tf => <option key={tf} value={tf}>Topic: {tf}</option>)}
                  </select>
                  <select
                    value={selectedDiff}
                    onChange={e => setSelectedDiff(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-1)', fontSize: '10px', outline: 'none' }}
                  >
                    {DIFF_FILTERS.map(df => <option key={df} value={df}>Diff: {df}</option>)}
                  </select>
                </div>
              </div>

              {/* List */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredProblems.map(p => (
                  <div
                    key={p.id}
                    onClick={() => { handleProblemSelect(p); setActiveTab('statement'); }}
                    style={{
                      padding: '10px 12px', borderRadius: 'var(--r-md)', cursor: 'pointer',
                      marginBottom: '6px', transition: 'all 0.15s',
                      background: selectedProblem.id === p.id ? 'var(--violet-soft)' : 'var(--black-3)',
                      border: `1px solid ${selectedProblem.id === p.id ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.04)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>{p.title}</span>
                      <span style={{ fontSize: '10px', color: diffColor[p.difficulty], fontWeight: 700 }}>{p.difficulty}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{p.topic}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'stdin' ? (
            /* TAB 2: CUSTOM INPUT STDIN */
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-1)' }}>
                📥 Custom Input (Standard Input / stdin)
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '12px' }}>
                Enter custom input arguments to test your solution.
              </p>
              <textarea
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="Enter input here..."
                style={{
                  flex: 1, width: '100%', padding: '12px',
                  borderRadius: 'var(--r-md)', background: 'var(--black-3)',
                  border: '1px solid rgba(255,255,255,0.08)', color: 'var(--green)',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                  outline: 'none', resize: 'none', lineHeight: 1.5,
                }}
              />
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setCustomInput(selectedProblem.defaultStdin || '')}
                style={{ marginTop: '10px', alignSelf: 'flex-end' }}
              >
                Reset to Default Stdin
              </button>
            </div>
          ) : (
            /* TAB 3: PROBLEM STATEMENT & OUTPUT RESULT */
            <div className="card" style={{ flex: 1, overflow: 'auto', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '10px', color: diffColor[selectedProblem.difficulty], fontWeight: 700,
                  background: `${diffColor[selectedProblem.difficulty]}18`, padding: '3px 10px', borderRadius: 'var(--r-pill)',
                  border: `1px solid ${diffColor[selectedProblem.difficulty]}35`,
                }}>
                  {selectedProblem.difficulty}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>{selectedProblem.topic}</span>
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>{selectedProblem.title}</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.75, whiteSpace: 'pre-line', marginBottom: '16px' }}>
                {selectedProblem.description}
              </p>

              {/* Examples */}
              {selectedProblem.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>Example {i + 1}:</div>
                  <div style={{
                    background: 'var(--black-3)', borderRadius: 'var(--r-md)',
                    padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                  }}>
                    <div><span style={{ color: 'var(--text-3)' }}>Input:  </span><span style={{ color: 'var(--cyan)' }}>{ex.input}</span></div>
                    <div><span style={{ color: 'var(--text-3)' }}>Output: </span><span style={{ color: 'var(--green)' }}>{ex.output}</span></div>
                    {ex.explain && <div style={{ color: 'var(--text-3)', marginTop: '4px', fontSize: '10px' }}>{`// ${ex.explain}`}</div>}
                  </div>
                </div>
              ))}

              {/* Execution Result Box */}
              {result && (
                <div style={{
                  marginTop: '16px', borderRadius: 'var(--r-md)', overflow: 'hidden',
                  border: `1px solid ${isAccepted ? 'rgba(0,229,160,0.35)' : 'rgba(255,77,109,0.35)'}`,
                }}>
                  {/* Result Header */}
                  <div style={{
                    padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px',
                    background: isAccepted ? 'rgba(0,229,160,0.08)' : 'rgba(255,77,109,0.08)',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '12px', color: isAccepted ? 'var(--green)' : 'var(--red)' }}>
                      {isAccepted ? '✅' : '❌'} {result.status?.description ?? 'Executed'}
                    </span>
                    {result.engine && (
                      <span style={{ fontSize: '9px', color: 'var(--cyan)', padding: '2px 7px', background: 'rgba(0,212,255,0.1)', borderRadius: '100px', border: '1px solid rgba(0,212,255,0.2)' }}>
                        {result.engine}
                      </span>
                    )}
                    {result.time && <span style={{ fontSize: '10px', color: 'var(--text-3)', marginLeft: 'auto' }}>⏱ {result.time}s</span>}
                  </div>

                  {/* Output Snippets */}
                  {(result.stdout || result.stderr || result.compile_output) && (
                    <div style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', maxHeight: '140px', overflow: 'auto', background: '#0a0a0a' }}>
                      {result.compile_output && <div style={{ color: 'var(--amber)', marginBottom: '6px' }}><strong>Compiler Message:</strong><br />{result.compile_output}</div>}
                      {result.stderr && <div style={{ color: 'var(--red)', marginBottom: '6px' }}><strong>Error Output:</strong><br />{result.stderr}</div>}
                      {result.stdout && <div style={{ color: 'var(--green)' }}><strong>Standard Output:</strong><br />{result.stdout}</div>}
                    </div>
                  )}

                  {result.message && (
                    <div style={{ padding: '6px 14px', fontSize: '10px', color: 'var(--text-3)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      ℹ {result.message}
                    </div>
                  )}
                </div>
              )}

              {/* GitHub Push Result */}
              {githubResult && (
                <div style={{
                  marginTop: '10px', padding: '10px 14px', borderRadius: 'var(--r-md)',
                  background: githubResult.success ? 'rgba(0,229,160,0.06)' : 'rgba(255,77,109,0.06)',
                  border: `1px solid ${githubResult.success ? 'rgba(0,229,160,0.25)' : 'rgba(255,77,109,0.25)'}`,
                  fontSize: '12px', color: githubResult.success ? 'var(--green)' : 'var(--red)',
                }}>
                  {githubResult.message}
                  {githubResult.url && (
                    <a href={githubResult.url} target="_blank" rel="noopener" style={{ display: 'block', fontSize: '10px', color: 'var(--cyan)', marginTop: '4px' }}>
                      🔗 View solution on GitHub →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Monaco Code Editor */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor Header Bar */}
          <div style={{
            padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0,
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 600, color: 'var(--cyan)',
              background: 'var(--cyan-soft)', padding: '3px 10px', borderRadius: '100px',
              border: '1px solid rgba(0,212,255,0.25)',
            }}>
              {selectedProblem.title.toLowerCase().replace(/\s+/g, '-')}.{language.value === 'javascript' ? 'js' : language.value === 'python' ? 'py' : language.value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Monaco Editor · {language.label}</div>

            <button
              onClick={() => {
                const tmpl = (selectedProblem.templates as any)[language.value] ?? (selectedProblem.templates as any).cpp;
                setCode(tmpl);
                if (editorRef.current) editorRef.current.setValue(tmpl);
              }}
              style={{
                marginLeft: 'auto', fontSize: '10px', color: 'var(--text-3)',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                padding: '3px 10px', borderRadius: '100px', cursor: 'pointer',
              }}
            >
              ↺ Reset Template
            </button>
          </div>

          {/* Monaco Editor Canvas */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={language.monaco}
              value={code}
              theme="vs-dark"
              onChange={v => setCode(v ?? '')}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                // Add keyboard shortcut Ctrl+Enter or Cmd+Enter to run code
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                  runCode();
                });
              }}
              options={{
                fontSize:             14,
                fontFamily:           "'JetBrains Mono', Consolas, monospace",
                fontLigatures:        true,
                minimap:              { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap:             'on',
                lineNumbers:          'on',
                renderLineHighlight:  'all',
                cursorBlinking:       'smooth',
                smoothScrolling:      true,
                padding:              { top: 16 },
                automaticLayout:      true,
                tabSize:              4,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
