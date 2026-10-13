import { execFile, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export interface ExecutionResult {
  status: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;
  memory: number | null;
  engine: string;
  configured: boolean;
}

const RUNNER_DIR = path.join(os.tmpdir(), 'nexusprep_runner');
if (!fs.existsSync(RUNNER_DIR)) {
  try {
    fs.mkdirSync(RUNNER_DIR, { recursive: true });
  } catch {}
}

/**
 * Runs a command with stdin, timeout, and buffer limits
 */
function runProcess(
  cmd: string,
  args: string[],
  stdin: string = '',
  timeoutMs: number = 8000
): Promise<{ stdout: string; stderr: string; exitCode: number | null; durationMs: number }> {
  return new Promise((resolve) => {
    const start = performance.now();
    let stdout = '';
    let stderr = '';
    let killed = false;

    const proc = spawn(cmd, args, {
      windowsHide: true,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    const timer = setTimeout(() => {
      killed = true;
      proc.kill('SIGKILL');
    }, timeoutMs);

    if (stdin && proc.stdin) {
      try {
        proc.stdin.write(stdin);
        proc.stdin.end();
      } catch {}
    } else if (proc.stdin) {
      proc.stdin.end();
    }

    proc.stdout.on('data', (d) => {
      if (stdout.length < 100000) stdout += d.toString();
    });

    proc.stderr.on('data', (d) => {
      if (stderr.length < 100000) stderr += d.toString();
    });

    proc.on('close', (exitCode) => {
      clearTimeout(timer);
      const durationMs = performance.now() - start;
      if (killed) {
        resolve({ stdout, stderr: 'Time Limit Exceeded (execution exceeded limit)', exitCode: 124, durationMs });
      } else {
        resolve({ stdout, stderr, exitCode, durationMs });
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      const durationMs = performance.now() - start;
      resolve({ stdout: '', stderr: err.message, exitCode: 1, durationMs });
    });
  });
}

/**
 * Executes code using local installed compilers (g++, gcc, python, node, javac)
 */
export async function executeLocally(
  code: string,
  language: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  const lang = language.toLowerCase();
  const id = `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // ── 1. Python ──────────────────────────────────────────────
  if (lang === 'python' || lang === 'py') {
    const pyFile = path.join(RUNNER_DIR, `${id}.py`);
    fs.writeFileSync(pyFile, code, 'utf-8');

    try {
      const res = await runProcess('python', [pyFile], stdin, 6000);
      try { fs.unlinkSync(pyFile); } catch {}

      const isTLE = res.exitCode === 124;
      const isSuccess = res.exitCode === 0;

      return {
        status: {
          id: isTLE ? 5 : isSuccess ? 3 : 11,
          description: isTLE ? 'Time Limit Exceeded' : isSuccess ? 'Accepted' : 'Runtime Error',
        },
        stdout: res.stdout || null,
        stderr: res.stderr || null,
        compile_output: null,
        time: (res.durationMs / 1000).toFixed(3),
        memory: 1024,
        engine: 'Native Python 3 Engine',
        configured: true,
      };
    } catch (e: any) {
      try { fs.unlinkSync(pyFile); } catch {}
      return {
        status: { id: 11, description: 'Runtime Error' },
        stdout: null,
        stderr: e.message,
        compile_output: null,
        time: null,
        memory: null,
        engine: 'Native Python 3 Engine',
        configured: true,
      };
    }
  }

  // ── 2. JavaScript / Node.js ────────────────────────────────
  if (lang === 'javascript' || lang === 'js' || lang === 'node') {
    const jsFile = path.join(RUNNER_DIR, `${id}.js`);
    fs.writeFileSync(jsFile, code, 'utf-8');

    try {
      const res = await runProcess('node', [jsFile], stdin, 6000);
      try { fs.unlinkSync(jsFile); } catch {}

      const isTLE = res.exitCode === 124;
      const isSuccess = res.exitCode === 0;

      return {
        status: {
          id: isTLE ? 5 : isSuccess ? 3 : 11,
          description: isTLE ? 'Time Limit Exceeded' : isSuccess ? 'Accepted' : 'Runtime Error',
        },
        stdout: res.stdout || null,
        stderr: res.stderr || null,
        compile_output: null,
        time: (res.durationMs / 1000).toFixed(3),
        memory: 2048,
        engine: 'Native Node.js V8 Engine',
        configured: true,
      };
    } catch (e: any) {
      try { fs.unlinkSync(jsFile); } catch {}
      return {
        status: { id: 11, description: 'Runtime Error' },
        stdout: null,
        stderr: e.message,
        compile_output: null,
        time: null,
        memory: null,
        engine: 'Native Node.js V8 Engine',
        configured: true,
      };
    }
  }

  // ── 3. C++ ─────────────────────────────────────────────────
  if (lang === 'cpp' || lang === 'c++') {
    const srcFile = path.join(RUNNER_DIR, `${id}.cpp`);
    const exeFile = path.join(RUNNER_DIR, `${id}.exe`);
    fs.writeFileSync(srcFile, code, 'utf-8');

    try {
      // Compile step
      const compRes = await runProcess('g++', [srcFile, '-O2', '-o', exeFile], '', 10000);
      if (compRes.exitCode !== 0) {
        try { fs.unlinkSync(srcFile); } catch {}
        return {
          status: { id: 6, description: 'Compilation Error' },
          stdout: null,
          stderr: compRes.stderr || null,
          compile_output: compRes.stderr || 'Compilation failed',
          time: null,
          memory: null,
          engine: 'Native MinGW G++ Compiler',
          configured: true,
        };
      }

      // Execute step
      const runRes = await runProcess(exeFile, [], stdin, 6000);
      try { fs.unlinkSync(srcFile); } catch {}
      try { fs.unlinkSync(exeFile); } catch {}

      const isTLE = runRes.exitCode === 124;
      const isSuccess = runRes.exitCode === 0;

      return {
        status: {
          id: isTLE ? 5 : isSuccess ? 3 : 11,
          description: isTLE ? 'Time Limit Exceeded' : isSuccess ? 'Accepted' : 'Runtime Error',
        },
        stdout: runRes.stdout || null,
        stderr: runRes.stderr || null,
        compile_output: null,
        time: (runRes.durationMs / 1000).toFixed(3),
        memory: 1024,
        engine: 'Native MinGW G++ Compiler',
        configured: true,
      };
    } catch (e: any) {
      try { fs.unlinkSync(srcFile); } catch {}
      try { fs.unlinkSync(exeFile); } catch {}
      return {
        status: { id: 11, description: 'Execution Error' },
        stdout: null,
        stderr: e.message,
        compile_output: null,
        time: null,
        memory: null,
        engine: 'Native MinGW G++ Compiler',
        configured: true,
      };
    }
  }

  // ── 4. C ───────────────────────────────────────────────────
  if (lang === 'c') {
    const srcFile = path.join(RUNNER_DIR, `${id}.c`);
    const exeFile = path.join(RUNNER_DIR, `${id}.exe`);
    fs.writeFileSync(srcFile, code, 'utf-8');

    try {
      const compRes = await runProcess('gcc', [srcFile, '-O2', '-o', exeFile], '', 10000);
      if (compRes.exitCode !== 0) {
        try { fs.unlinkSync(srcFile); } catch {}
        return {
          status: { id: 6, description: 'Compilation Error' },
          stdout: null,
          stderr: compRes.stderr || null,
          compile_output: compRes.stderr || 'Compilation failed',
          time: null,
          memory: null,
          engine: 'Native MinGW GCC Compiler',
          configured: true,
        };
      }

      const runRes = await runProcess(exeFile, [], stdin, 6000);
      try { fs.unlinkSync(srcFile); } catch {}
      try { fs.unlinkSync(exeFile); } catch {}

      const isTLE = runRes.exitCode === 124;
      const isSuccess = runRes.exitCode === 0;

      return {
        status: {
          id: isTLE ? 5 : isSuccess ? 3 : 11,
          description: isTLE ? 'Time Limit Exceeded' : isSuccess ? 'Accepted' : 'Runtime Error',
        },
        stdout: runRes.stdout || null,
        stderr: runRes.stderr || null,
        compile_output: null,
        time: (runRes.durationMs / 1000).toFixed(3),
        memory: 1024,
        engine: 'Native MinGW GCC Compiler',
        configured: true,
      };
    } catch (e: any) {
      try { fs.unlinkSync(srcFile); } catch {}
      try { fs.unlinkSync(exeFile); } catch {}
      return {
        status: { id: 11, description: 'Execution Error' },
        stdout: null,
        stderr: e.message,
        compile_output: null,
        time: null,
        memory: null,
        engine: 'Native MinGW GCC Compiler',
        configured: true,
      };
    }
  }

  // ── 5. Java ────────────────────────────────────────────────
  if (lang === 'java') {
    // Extract public class name or default to Main
    const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
    const className = match ? match[1] : 'Main';
    const subDir = path.join(RUNNER_DIR, id);
    fs.mkdirSync(subDir, { recursive: true });
    const javaFile = path.join(subDir, `${className}.java`);
    fs.writeFileSync(javaFile, code, 'utf-8');

    try {
      const compRes = await runProcess('javac', [javaFile], '', 10000);
      if (compRes.exitCode !== 0) {
        try { fs.rmSync(subDir, { recursive: true, force: true }); } catch {}
        return {
          status: { id: 6, description: 'Compilation Error' },
          stdout: null,
          stderr: compRes.stderr || null,
          compile_output: compRes.stderr || 'Compilation failed',
          time: null,
          memory: null,
          engine: 'Native JDK 25 Compiler',
          configured: true,
        };
      }

      const runRes = await runProcess('java', ['-cp', subDir, className], stdin, 6000);
      try { fs.rmSync(subDir, { recursive: true, force: true }); } catch {}

      const isTLE = runRes.exitCode === 124;
      const isSuccess = runRes.exitCode === 0;

      return {
        status: {
          id: isTLE ? 5 : isSuccess ? 3 : 11,
          description: isTLE ? 'Time Limit Exceeded' : isSuccess ? 'Accepted' : 'Runtime Error',
        },
        stdout: runRes.stdout || null,
        stderr: runRes.stderr || null,
        compile_output: null,
        time: (runRes.durationMs / 1000).toFixed(3),
        memory: 4096,
        engine: 'Native JDK 25 Runtime',
        configured: true,
      };
    } catch (e: any) {
      try { fs.rmSync(subDir, { recursive: true, force: true }); } catch {}
      return {
        status: { id: 11, description: 'Execution Error' },
        stdout: null,
        stderr: e.message,
        compile_output: null,
        time: null,
        memory: null,
        engine: 'Native JDK 25 Runtime',
        configured: true,
      };
    }
  }

  // Unsupported language
  return {
    status: { id: 13, description: 'Unsupported Language' },
    stdout: null,
    stderr: `Language "${language}" is not supported for native local execution.`,
    compile_output: null,
    time: null,
    memory: null,
    engine: 'None',
    configured: false,
  };
}
