import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: 'Problem slug or title is required' }, { status: 400 });
    }

    // Clean slug: e.g. "https://leetcode.com/problems/lru-cache/" -> "lru-cache"
    const cleanedSlug = slug
      .replace(/https?:\/\/(www\.)?leetcode\.com\/problems\//, '')
      .replace(/\/.*$/, '')
      .trim()
      .toLowerCase();

    // Query LeetCode Public GraphQL API
    const query = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          title
          titleSlug
          difficulty
          content
          topicTags {
            name
          }
          codeSnippets {
            lang
            langSlug
            code
          }
          exampleTestcaseList
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ query, variables: { titleSlug: cleanedSlug } }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API returned ${response.status}`);
    }

    const data = await response.json();
    const q = data?.data?.question;

    if (!q) {
      return NextResponse.json({ error: `Problem "${cleanedSlug}" not found on LeetCode` }, { status: 404 });
    }

    // Strip HTML tags for clean text display
    const cleanDescription = q.content
      ? q.content
          .replace(/<pre>/g, '\n```\n')
          .replace(/<\/pre>/g, '\n```\n')
          .replace(/<code>/g, '`')
          .replace(/<\/code>/g, '`')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim()
      : 'No description available.';

    // Extract code snippets into templates dictionary
    const templates: Record<string, string> = {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\n// LeetCode #${q.questionId}: ${q.title}\n`,
      java: `import java.util.*;\n\n// LeetCode #${q.questionId}: ${q.title}\npublic class Solution {\n`,
      python: `from typing import List, Optional\n\n# LeetCode #${q.questionId}: ${q.title}\n`,
      javascript: `// LeetCode #${q.questionId}: ${q.title}\n`,
    };

    q.codeSnippets?.forEach((s: any) => {
      if (s.langSlug === 'cpp') templates.cpp += s.code;
      if (s.langSlug === 'java') templates.java += s.code + '\n}';
      if (s.langSlug === 'python3' || s.langSlug === 'python') templates.python += s.code;
      if (s.langSlug === 'javascript') templates.javascript += s.code;
    });

    const topic = q.topicTags?.[0]?.name || 'Algorithms';

    return NextResponse.json({
      id: parseInt(q.questionId) || Date.now(),
      title: q.title,
      topic: topic,
      difficulty: q.difficulty,
      description: cleanDescription,
      examples: [
        {
          input: q.exampleTestcaseList?.[0] || 'See problem description',
          output: q.exampleTestcaseList?.[1] || 'Expected result',
          explain: 'Example testcase from LeetCode',
        },
      ],
      defaultStdin: q.exampleTestcaseList?.join('\n') || '',
      templates,
    });
  } catch (err: any) {
    console.error('[leetcode/problem] error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch LeetCode question' }, { status: 500 });
  }
}
