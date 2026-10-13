import { NextRequest, NextResponse } from 'next/server';
import { executeLocally } from '@/lib/compiler';

// Standard Judge0 CE Language IDs
const JUDGE0_LANG_IDS: Record<string, number> = {
  cpp:        54, // C++ (GCC 9.2.0)
  c:          50, // C (GCC 9.2.0)
  java:       62, // Java (OpenJDK 13.0.1)
  python:     71, // Python (3.8.1)
  py:         71,
  javascript: 63, // JavaScript (Node.js 12.14.0)
  js:         63,
  typescript: 74, // TypeScript (3.7.4)
  ts:         74,
};

export async function POST(req: NextRequest) {
  try {
    const { code, language, stdin } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'code and language are required' }, { status: 400 });
    }

    const langKey = language.toLowerCase();
    const judge0Key = process.env.JUDGE0_API_KEY;
    const judge0Host = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

    // ── 1. If Judge0 is configured with a valid key, execute via Judge0 ────
    if (judge0Key && judge0Key.trim().length > 0) {
      try {
        const langId = JUDGE0_LANG_IDS[langKey] || 54;
        const res = await fetch(`https://${judge0Host}/submissions?wait=true&fields=*`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': judge0Key.trim(),
            'X-RapidAPI-Host': judge0Host,
          },
          body: JSON.stringify({
            language_id: langId,
            source_code: code,
            stdin: stdin || '',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({
            status: {
              id:          data.status?.id ?? 3,
              description: data.status?.description ?? 'Accepted',
            },
            stdout:         data.stdout ?? null,
            stderr:         data.stderr ?? null,
            compile_output: data.compile_output ?? null,
            time:           data.time ? `${data.time}` : null,
            memory:         data.memory ? Math.round(data.memory) : null,
            engine:         'Judge0 Enterprise Engine',
            configured:     true,
          });
        }
      } catch (judge0Err: any) {
        console.warn('[compile] Judge0 failed, falling back to native engine:', judge0Err.message);
      }
    }

    // ── 2. Native System Compiler Execution (MinGW g++, Python 3, Node V8, JDK) ──
    try {
      const localResult = await executeLocally(code, language, stdin || '');
      return NextResponse.json(localResult);
    } catch (localErr: any) {
      console.error('[compile] Local execution failed:', localErr);
    }

    // ── 3. Unconfigured / Error fallback ──────────────────────────────────────
    return NextResponse.json({
      status: { id: 13, description: 'Compiler Unconfigured' },
      stdout: null,
      stderr: 'No execution engine available. Install g++/python locally or configure JUDGE0_API_KEY in .env.local.',
      compile_output: null,
      time: null,
      memory: null,
      engine: null,
      configured: false,
    });

  } catch (err: any) {
    console.error('[compile] error:', err);
    return NextResponse.json({
      status: { id: 13, description: 'Execution Error' },
      stdout: null,
      stderr: err.message || 'Internal server error',
      compile_output: null,
      time: null,
      memory: null,
      configured: false,
    }, { status: 500 });
  }
}
