import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { message, stats } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: `[Demo Mode — Add GEMINI_API_KEY to .env.local]\n\nYou asked: "${message}"\n\nBased on your profile:\n• Solved 245/300 problems (82% completion)\n• Streak: 21 days 🔥\n• Weak area: Graph DFS/BFS\n• Strong: Arrays, Dynamic Programming\n\nRecommendation: Practice LeetCode #200 (Number of Islands) and #695 (Max Area of Island) to strengthen your Graph DFS skills.`,
        demo: true,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ['gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro', 'gemini-2.5-flash'];

    const systemContext = `You are an expert coding interview coach for a student named Anubhab.
Their profile:
- Solved: ${stats?.easy_solved ?? 90} Easy, ${stats?.medium_solved ?? 110} Medium, ${stats?.hard_solved ?? 45} Hard
- Streak: ${stats?.streak ?? 21} days
- Weak areas: ${stats?.error_tags?.join(', ') ?? 'Graph DFS, BFS'}
- Strong: ${stats?.recent_topics?.slice(0,3).join(', ') ?? 'Arrays, DP, Trees'}
- Primary language: ${stats?.primary_language ?? 'C++'}

Give concise, actionable, personalized advice. Use bullet points for clarity. Keep responses under 200 words.`;

    let reply = '';
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`${systemContext}\n\nStudent question: ${message}`);
        reply = result.response.text();
        if (reply) break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!reply && lastError) {
      throw lastError;
    }

    return NextResponse.json({ reply, demo: false });

  } catch (err: any) {
    console.error('[ai/chat] error:', err);
    return NextResponse.json({ reply: `AI error: ${err.message}. Check your GEMINI_API_KEY.`, error: err.message });
  }
}
