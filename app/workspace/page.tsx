'use client';
import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Monaco must be dynamically imported (browser only)
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false, loading: () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)', fontSize: '13px' }}>
    Loading editor...
  </div>
) });

/* ── Problems List ─────────────────────────────────────────────────────── */
const PROBLEMS = [
  { id: 1, title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.', examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explain: 'nums[0] + nums[1] == 9' }, { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explain: '' }], templates: { cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your solution here\n    unordered_map<int,int> mp;\n    for (int i = 0; i < nums.size(); i++) {\n        if (mp.count(target - nums[i]))\n            return {mp[target - nums[i]], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2,7,11,15};\n    int target = 9;\n    auto res = twoSum(nums, target);\n    cout << "[" << res[0] << "," << res[1] << "]" << endl;\n    return 0;\n}', java: 'import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer,Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (map.containsKey(target - nums[i]))\n                return new int[]{map.get(target - nums[i]), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        int[] res = s.twoSum(new int[]{2,7,11,15}, 9);\n        System.out.println(Arrays.toString(res));\n    }\n}', python: 'from typing import List\n\ndef twoSum(nums: List[int], target: int) -> List[int]:\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []\n\nprint(twoSum([2,7,11,15], 9))', javascript: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        if (map.has(target - nums[i])) return [map.get(target - nums[i]), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconsole.log(twoSum([2,7,11,15], 9));' } },
  { id: 2, title: 'Reverse Linked List', topic: 'Linked Lists', difficulty: 'Easy', description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explain: '' }], templates: { cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* nxt = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}\n\nint main() {\n    // Build list: 1->2->3->4->5\n    ListNode* head = new ListNode(1);\n    head->next = new ListNode(2);\n    head->next->next = new ListNode(3);\n    auto* r = reverseList(head);\n    while (r) { cout << r->val << " "; r = r->next; }\n    return 0;\n}', python: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n\n# Build: 1->2->3\nh = ListNode(1, ListNode(2, ListNode(3)))\nr = reverseList(h)\nwhile r:\n    print(r.val, end=" ")\n    r = r.next', java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}', javascript: 'function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}\nconsole.log("Linked list reversed");' } },
  { id: 3, title: 'Maximum Subarray', topic: 'Dynamic Programming', difficulty: 'Medium', description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nThis is the classic Kadane's Algorithm problem.", examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explain: 'Subarray [4,-1,2,1] has the largest sum = 6' }], templates: { cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    int maxSum = nums[0], curr = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        curr = max(nums[i], curr + nums[i]);\n        maxSum = max(maxSum, curr);\n    }\n    return maxSum;\n}\n\nint main() {\n    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};\n    cout << maxSubArray(nums) << endl; // 6\n    return 0;\n}', python: 'from typing import List\n\ndef maxSubArray(nums: List[int]) -> int:\n    max_sum = curr = nums[0]\n    for n in nums[1:]:\n        curr = max(n, curr + n)\n        max_sum = max(max_sum, curr)\n    return max_sum\n\nprint(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # 6', java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        int maxSum = nums[0], curr = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            curr = Math.max(nums[i], curr + nums[i]);\n            maxSum = Math.max(maxSum, curr);\n        }\n        return maxSum;\n    }\n    public static void main(String[] a) {\n        System.out.println(new Solution().maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));\n    }\n}', javascript: 'function maxSubArray(nums) {\n    let maxSum = nums[0], curr = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        maxSum = Math.max(maxSum, curr);\n    }\n    return maxSum;\n}\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));' } },
];

const LANG_OPTIONS = [
  { value: 'cpp',        label: 'C++',        monaco: 'cpp' },
  { value: 'java',       label: 'Java',       monaco: 'java' },
  { value: 'python',     label: 'Python',     monaco: 'python' },
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript' },
];

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
  demo?:          boolean;
  message?:       string;
  error?:         string;
};

export default function WorkspacePage() {
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [language, setLanguage]               = useState(LANG_OPTIONS[0]);
  const [code, setCode]                       = useState(PROBLEMS[0].templates.cpp);
  const [running, setRunning]                 = useState(false);
  const [submitting, setSubmitting]           = useState(false);
  const [result, setResult]                   = useState<RunResult | null>(null);
  const [githubResult, setGithubResult]       = useState<{ success: boolean; message: string; url?: string } | null>(null);
  const [activeTab, setActiveTab]             = useState<'output'|'problems'>('output');
  const editorRef = useRef<any>(null);

  const handleProblemSelect = (p: typeof PROBLEMS[0]) => {
    setSelectedProblem(p);
    const tmpl = (p.templates as any)[language.value] ?? (p.templates as any).cpp;
    setCode(tmpl);
    setResult(null);
    setGithubResult(null);
  };

  const handleLangChange = (val: string) => {
    const lang = LANG_OPTIONS.find(l => l.value === val)!;
    setLanguage(lang);
    const tmpl = (selectedProblem.templates as any)[val] ?? (selectedProblem.templates as any).cpp;
    setCode(tmpl);
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
        body:    JSON.stringify({ code: currentCode, language: language.value }),
      });
      const data: RunResult = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({ status: { id: 0, description: 'Network Error' }, stdout: null, stderr: e.message, compile_output: null, time: null, memory: null });
    }
    setRunning(false);
  }, [code, language]);

  const submitAndPush = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() ?? code;
    setSubmitting(true);
    setGithubResult(null);

    // First compile
    let compileOk = false;
    try {
      const compRes = await fetch('/api/compile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code: currentCode, language: language.value }),
      });
      const compData: RunResult = await compRes.json();
      setResult(compData);
      compileOk = compData.status?.id === 3; // 3 = Accepted in Judge0
      if (!compileOk && !compData.demo) {
        setGithubResult({ success: false, message: '❌ Fix compilation errors before pushing to GitHub.' });
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
  }, [code, language, selectedProblem]);

  const isAccepted = result?.status?.id === 3;
  const hasError   = result && !isAccepted;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h) - 48px)', gap: 0 }}>

      {/* ── Topbar controls ──────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 0 16px', flexShrink: 0, flexWrap: 'wrap',
      }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '18px' }}>⌨ Code Workspace</h1>
          <p className="page-subtitle">Monaco Editor · Judge0 Compiler · Auto GitHub Push</p>
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
          >
            {running ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>↻</span> Running...</> : '▶ Run Code'}
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

      {/* ── Main split ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr', gap: '16px', minHeight: 0 }}>

        {/* Left: Problem / Problem List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
          {/* Tab switch */}
          <div style={{
            display: 'flex', background: 'var(--black-3)', borderRadius: 'var(--r-pill)',
            padding: '3px', gap: '3px', flexShrink: 0,
          }}>
            {(['output','problems'] as const).map(t => (
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
              >{t === 'output' ? '📄 Problem' : '📋 All Problems'}</button>
            ))}
          </div>

          {activeTab === 'problems' ? (
            /* Problems list */
            <div className="card" style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
              {PROBLEMS.map(p => (
                <div
                  key={p.id}
                  onClick={() => { handleProblemSelect(p); setActiveTab('output'); }}
                  style={{
                    padding: '10px 12px', borderRadius: 'var(--r-md)', cursor: 'pointer',
                    marginBottom: '6px', transition: 'all 0.15s',
                    background: selectedProblem.id === p.id ? 'var(--violet-soft)' : 'transparent',
                    border: `1px solid ${selectedProblem.id === p.id ? 'rgba(124,58,237,0.35)' : 'transparent'}`,
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
          ) : (
            /* Problem statement */
            <div className="card" style={{ flex: 1, overflow: 'auto', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', color: diffColor[selectedProblem.difficulty], fontWeight: 700,
                  background: `${diffColor[selectedProblem.difficulty]}18`, padding: '3px 10px', borderRadius: 'var(--r-pill)',
                  border: `1px solid ${diffColor[selectedProblem.difficulty]}35`,
                }}>
                  {selectedProblem.difficulty}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>{selectedProblem.topic}</span>
              </div>

              <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>{selectedProblem.title}</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.75, whiteSpace: 'pre-line', marginBottom: '16px' }}>
                {selectedProblem.description}
              </p>

              {selectedProblem.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '6px' }}>Example {i + 1}:</div>
                  <div style={{
                    background: 'var(--black-3)', borderRadius: 'var(--r-md)',
                    padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                  }}>
                    <div><span style={{ color: 'var(--text-3)' }}>Input:  </span><span style={{ color: 'var(--cyan)' }}>{ex.input}</span></div>
                    <div><span style={{ color: 'var(--text-3)' }}>Output: </span><span style={{ color: 'var(--green)' }}>{ex.output}</span></div>
                    {ex.explain && <div style={{ color: 'var(--text-3)', marginTop: '4px', fontSize: '11px' }}>// {ex.explain}</div>}
                  </div>
                </div>
              ))}

              {/* Result panel */}
              {result && (
                <div style={{
                  marginTop: '12px', borderRadius: 'var(--r-md)', overflow: 'hidden',
                  border: `1px solid ${isAccepted ? 'rgba(0,229,160,0.3)' : 'rgba(255,77,109,0.3)'}`,
                }}>
                  {/* Status bar */}
                  <div style={{
                    padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px',
                    background: isAccepted ? 'rgba(0,229,160,0.08)' : 'rgba(255,77,109,0.08)',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '12px', color: isAccepted ? 'var(--green)' : 'var(--red)' }}>
                      {isAccepted ? '✅' : '❌'} {result.status?.description ?? 'Unknown'}
                    </span>
                    {result.time && <span style={{ fontSize: '10px', color: 'var(--text-3)', marginLeft: 'auto' }}>⏱ {result.time}s · 💾 {result.memory ?? '—'} KB</span>}
                    {result.demo && <span style={{ fontSize: '9px', color: 'var(--amber)', padding: '2px 7px', background: 'rgba(255,179,71,0.1)', borderRadius: '100px', border: '1px solid rgba(255,179,71,0.3)' }}>Demo Mode</span>}
                  </div>

                  {/* Output */}
                  {(result.stdout || result.stderr || result.compile_output) && (
                    <div style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', maxHeight: '120px', overflow: 'auto' }}>
                      {result.compile_output && <div style={{ color: 'var(--amber)', marginBottom: '4px' }}><strong>Compile:</strong><br />{result.compile_output}</div>}
                      {result.stderr && <div style={{ color: 'var(--red)', marginBottom: '4px' }}><strong>Error:</strong><br />{result.stderr}</div>}
                      {result.stdout && <div style={{ color: 'var(--green)' }}><strong>Output:</strong><br />{result.stdout}</div>}
                    </div>
                  )}
                  {result.message && (
                    <div style={{ padding: '6px 14px', fontSize: '10px', color: 'var(--text-3)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      ℹ {result.message}
                    </div>
                  )}
                </div>
              )}

              {/* GitHub push result */}
              {githubResult && (
                <div style={{
                  marginTop: '8px', padding: '10px 14px', borderRadius: 'var(--r-md)',
                  background: githubResult.success ? 'rgba(0,229,160,0.06)' : 'rgba(255,77,109,0.06)',
                  border: `1px solid ${githubResult.success ? 'rgba(0,229,160,0.25)' : 'rgba(255,77,109,0.25)'}`,
                  fontSize: '12px', color: githubResult.success ? 'var(--green)' : 'var(--red)',
                }}>
                  {githubResult.message}
                  {githubResult.url && (
                    <a href={githubResult.url} target="_blank" rel="noopener" style={{ display: 'block', fontSize: '10px', color: 'var(--cyan)', marginTop: '4px' }}>
                      🔗 View on GitHub →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Monaco Editor */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor header */}
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
                editorRef.current?.setValue(tmpl);
              }}
              style={{
                marginLeft: 'auto', fontSize: '10px', color: 'var(--text-3)',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                padding: '3px 10px', borderRadius: '100px', cursor: 'pointer',
              }}
            >
              ↺ Reset
            </button>
          </div>

          {/* Monaco */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={language.monaco}
              value={code}
              theme="vs-dark"
              onChange={v => setCode(v ?? '')}
              onMount={editor => { editorRef.current = editor; }}
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
                inlineSuggest:        { enabled: true },
              }}
            />
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
