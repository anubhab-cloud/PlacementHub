import { NextRequest, NextResponse } from 'next/server';

// GET /api/stats — returns user stats from localStorage fallback or Supabase
export async function GET(req: NextRequest) {
  // In production this would read from Supabase
  // For now returns persistent mock that AI can analyze
  return NextResponse.json({
    easy_solved:    90,
    easy_total:     100,
    medium_solved:  110,
    medium_total:   140,
    hard_solved:    45,
    hard_total:     60,
    streak:         21,
    github_pushes:  85,
    primary_language: 'C++',
    recent_topics:  ['Arrays', 'Dynamic Programming', 'Graphs', 'Trees', 'Backtracking'],
    error_tags:     ['Graph DFS', 'BFS', 'Backtracking'],
    total_submissions: 312,
    acceptance_rate: 78.5,
  });
}

// POST /api/stats — update a stat (e.g. after a successful submission)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // In production: upsert into Supabase users table
    console.log('[stats] Updated:', body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
