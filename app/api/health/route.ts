import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    judge0:  !!process.env.JUDGE0_API_KEY,
    gemini:  !!process.env.GEMINI_API_KEY,
    github:  !!(process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME),
    supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  });
}
