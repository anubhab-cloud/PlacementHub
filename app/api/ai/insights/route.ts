import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { stats } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        weakness:      'Graph Algorithms (DFS/BFS)',
        strengths:     ['Array Manipulation', 'Dynamic Programming'],
        recommended:   'Solve 3 Medium DFS Problems today',
        dailyGoal:     75,
        tip:           'Focus on recursive DFS patterns. Practice on LeetCode #200, #695, #547.',
        demo:          true,
        message:       'Add GEMINI_API_KEY to .env.local for real AI analysis.',
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp',
      'gemini-1.0-pro',
      'gemini-pro'
    ];

    let text = '';
    let lastError = null;

    const prompt = `
You are a coding interview performance analyst. Analyze the following student data and return a JSON response.

Student Stats:
- Easy Solved: ${stats?.easy_solved ?? 90}/${stats?.easy_total ?? 100}
- Medium Solved: ${stats?.medium_solved ?? 110}/${stats?.medium_total ?? 140}
- Hard Solved: ${stats?.hard_solved ?? 45}/${stats?.hard_total ?? 60}
- Recent topics attempted: ${stats?.recent_topics?.join(', ') ?? 'Arrays, DP, Graphs, Trees'}
- Tags with most errors: ${stats?.error_tags?.join(', ') ?? 'Graph DFS, BFS, Backtracking'}
- Current streak: ${stats?.streak ?? 21} days
- Language used most: ${stats?.primary_language ?? 'C++'}

Respond ONLY with a valid JSON object (no markdown, no code fences) with this exact shape:
{
  "weakness": "string - the single most critical weak topic",
  "strengths": ["string", "string"],
  "recommended": "string - specific actionable task for today",
  "dailyGoal": number between 50 and 100,
  "tip": "string - one concrete interview tip based on the weak area"
}
`;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        text = result.response.text().trim();
        if (text) break;
      } catch (err: any) {
        console.warn(`[Gemini] Model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    if (!text) {
      throw lastError || new Error('All Gemini models failed');
    }

    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ ...parsed, demo: false });

  } catch (err: any) {
    console.error('[ai/insights] error:', err);
    return NextResponse.json({
      weakness:    'Graph Algorithms (DFS/BFS)',
      strengths:   ['Dynamic Programming', 'Arrays'],
      recommended: 'Solve 3 Medium DFS Problems today',
      dailyGoal:   70,
      tip:         'Practice recursive DFS with memoization.',
      demo:        true,
      error:       err.message,
    });
  }
}
