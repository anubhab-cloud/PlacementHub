import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Intelligent offline response generator tailored for placement & DSA prep
function generateSmartFallback(message: string, stats: any): string {
  const lower = message.toLowerCase();

  const easy = stats?.easy_solved ?? 90;
  const medium = stats?.medium_solved ?? 110;
  const hard = stats?.hard_solved ?? 45;
  const total = easy + medium + hard;
  const streak = stats?.streak ?? 21;
  const lang = stats?.primary_language ?? 'C++';

  if (lower.includes('study today') || lower.includes('what should i study') || lower.includes('today')) {
    return `🎯 **Recommended Plan for Today:**\n\n• **Focus Topic:** Graph Algorithms (DFS & BFS) — your current error rate is higher here.\n• **Target Problems:**\n  1. LeetCode #200: *Number of Islands* (Medium)\n  2. LeetCode #547: *Number of Provinces* (Medium)\n  3. LeetCode #695: *Max Area of Island* (Medium)\n\n• **Strategy in ${lang}:** Write out adjacency matrix/list representation clearly before starting your DFS recursive call. Keep track of visited nodes!`;
  }

  if (lower.includes('bfs vs dfs') || lower.includes('graph bfs') || lower.includes('bfs') || lower.includes('dfs')) {
    return `💡 **Graph BFS vs DFS Breakdown:**\n\n• **BFS (Breadth-First Search):**\n  - Uses a **Queue** (FIFO).\n  - Explores level by level (nodes at distance 1, then distance 2...).\n  - Best for: **Shortest path in unweighted graphs**.\n\n• **DFS (Depth-First Search):**\n  - Uses a **Stack** or **Recursion**.\n  - Explores as deep as possible down one branch before backtracking.\n  - Best for: **Cycle detection**, **topological sort**, and **connected components**.\n\n⚡ **Pro Tip:** In interviews, always mention space complexity! BFS takes O(Width) memory, DFS takes O(Height) recursion stack.`;
  }

  if (lower.includes('tired') || lower.includes('break') || lower.includes('sleep')) {
    return `😴 **Coding Burnout & Break Tip:**\n\n• Take a **15-minute Pomodoro break** right now!\n• Hydrate and rest your eyes away from screens.\n• Remind yourself: You have already solved **${total} problems** with a **${streak}-day streak** 🔥. Consistency beats intensity!\n\nCome back refreshed and tackle just 1 Medium problem.`;
  }

  if (lower.includes('mock') || lower.includes('interview tip') || lower.includes('tip')) {
    return `⚡ **Top Mock Interview Tips:**\n\n1. **Think Out Loud:** Never stay silent for more than 30 seconds. Explain your thought process to the interviewer.\n2. **Clarify Constraints:** Ask about input size bounds, memory limits, and edge cases (empty arrays, negative numbers).\n3. **Start with Brute Force:** Briefly outline the naive approach, state its O(N²) time complexity, then optimize to O(N log N) or O(N).\n4. **Dry Run before Coding:** Walk through a sample test case with pencil and paper before typing code.`;
  }

  if (lower.includes('dp') || lower.includes('dynamic programming')) {
    return `🧩 **Dynamic Programming Master Plan:**\n\n1. **Identify States:** What changes at each step? (e.g. index \`i\`, remaining capacity \`w\`).\n2. **Write Base Cases:** Smallest inputs (e.g. \`n = 0\` or \`n = 1\`).\n3. **State Transition:** Build state equation: \`dp[i] = dp[i-1] + dp[i-2]\`.\n4. **Optimize Space:** Convert 2D DP table to 1D array if only depending on previous row.`;
  }

  if (lower.includes('quicksort') || lower.includes('time complexity') || lower.includes('sorting')) {
    return `⏱️ **Sorting Algorithm Time & Space Complexities:**\n\n• **QuickSort:** Best/Avg: O(N log N), Worst: O(N²), Space: O(log N) stack.\n• **MergeSort:** Best/Avg/Worst: O(N log N), Space: O(N) auxiliary.\n• **HeapSort:** Best/Avg/Worst: O(N log N), Space: O(1) in-place.\n\nKey interview question: *"Why is QuickSort preferred over MergeSort in practice?"*\nAnswer: QuickSort has lower hidden constant factors and better CPU cache locality!`;
  }

  // Default response if prompt is general
  return `🤖 **PlacementHub AI Assistant**\n\nGreat query regarding: "${message}"\n\nHere are tailored insights for your prep status:\n• **Current Stats:** ${total} problems solved (${easy} Easy, ${medium} Medium, ${hard} Hard).\n• **Streak:** ${streak} days active 🔥\n• **Recommended focus:** ${stats?.error_tags?.[0] || 'Graph DFS'} & ${stats?.error_tags?.[1] || 'Dynamic Programming'}.\n\n💡 **Actionable Advice:** Break your target into 2 Medium problems daily using ${lang}. Practice coding clean variable names and verifying constraints!`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, stats } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isValidKey = apiKey && apiKey.startsWith('AIzaSy');

    if (isValidKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];

        const systemContext = `You are an expert coding interview coach for a student named Anubhab.
Their profile:
- Solved: ${stats?.easy_solved ?? 90} Easy, ${stats?.medium_solved ?? 110} Medium, ${stats?.hard_solved ?? 45} Hard
- Streak: ${stats?.streak ?? 21} days
- Weak areas: ${stats?.error_tags?.join(', ') ?? 'Graph DFS, BFS'}
- Primary language: ${stats?.primary_language ?? 'C++'}

Give concise, actionable, personalized advice. Use bullet points for clarity. Keep responses under 200 words.`;

        let reply = '';
        for (const modelName of modelsToTry) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(`${systemContext}\n\nStudent question: ${message}`);
            reply = result.response.text();
            if (reply) break;
          } catch (err: any) {
            console.warn(`[Gemini] Model ${modelName} failed:`, err.message);
          }
        }

        if (reply) {
          return NextResponse.json({ reply, demo: false });
        }
      } catch (err: any) {
        console.warn('[ai/chat] Gemini API failed, falling back to smart engine:', err.message);
      }
    }

    // Fallback to intelligent local response engine if API key is invalid or fails
    const fallbackReply = generateSmartFallback(message, stats);
    return NextResponse.json({ reply: fallbackReply, demo: true });

  } catch (err: any) {
    console.error('[ai/chat] error:', err);
    const fallbackReply = generateSmartFallback('general prep', {});
    return NextResponse.json({ reply: fallbackReply, demo: true });
  }
}

