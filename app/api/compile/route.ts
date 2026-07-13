import { NextRequest, NextResponse } from 'next/server';

// Judge0 language IDs
const LANG_MAP: Record<string, number> = {
  cpp:    54,  // C++ (GCC 9.2.0)
  c:      50,  // C (GCC 9.2.0)
  java:   62,  // Java (OpenJDK 13.0.1)
  python: 71,  // Python (3.8.1)
  js:     63,  // JavaScript (Node.js 12.14.0)
  sql:    82,  // SQL (SQLite 3.31.1)
};

export async function POST(req: NextRequest) {
  try {
    const { code, language, stdin = '' } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'code and language are required' }, { status: 400 });
    }

    const langId = LANG_MAP[language.toLowerCase()];
    if (!langId) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    const apiKey  = process.env.JUDGE0_API_KEY;
    const apiHost = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

    // ── Fallback: mock mode when no API key ───────────────
    if (!apiKey) {
      return NextResponse.json({
        status: { id: 3, description: 'Accepted' },
        stdout: `[Demo Mode] Output for ${language}:\nHello, World!\n`,
        stderr: null,
        compile_output: null,
        time: '0.05',
        memory: 1024,
        message: 'API key not configured. Add JUDGE0_API_KEY to .env.local for real compilation.',
        demo: true,
      });
    }

    // ── Submit to Judge0 ──────────────────────────────────
    const submitRes = await fetch(
      `https://${apiHost}/submissions?base64_encoded=false&wait=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
        },
        body: JSON.stringify({
          language_id: langId,
          source_code: code,
          stdin,
          cpu_time_limit: 5,
          memory_limit: 128000,
        }),
      }
    );

    if (!submitRes.ok) {
      const err = await submitRes.text();
      return NextResponse.json({ error: `Judge0 error: ${err}` }, { status: 502 });
    }

    const result = await submitRes.json();

    return NextResponse.json({
      status:         result.status,
      stdout:         result.stdout,
      stderr:         result.stderr,
      compile_output: result.compile_output,
      time:           result.time,
      memory:         result.memory,
    });

  } catch (err: any) {
    console.error('[compile] error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
