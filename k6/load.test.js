/**
 * PlacementHub — k6 Load Test
 * ──────────────────────────────
 * Purpose : Simulate realistic concurrent usage across all API endpoints.
 * Stages  :
 *   0→10 VUs over 30s  (ramp-up)
 *   10 VUs for 1 min   (sustained load)
 *   10→0 VUs over 20s  (ramp-down)
 * Run     : k6 run k6/load.test.js
 * Override: k6 run k6/load.test.js --env BASE_URL=https://your-domain.com
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

/* ── Custom Metrics ──────────────────────────────────────────── */
export const apiErrors      = new Counter('api_errors');
export const compileErrors  = new Counter('compile_errors');
export const errorRate      = new Rate('error_rate');
export const compileDuration= new Trend('compile_duration_ms', true);
export const aiDuration     = new Trend('ai_insights_duration_ms', true);

/* ── Test Config ─────────────────────────────────────────────── */
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // ramp up
    { duration: '1m',  target: 10 },   // sustained
    { duration: '20s', target: 0  },   // ramp down
  ],
  thresholds: {
    http_req_failed:        ['rate<0.05'],      // <5% HTTP failures
    http_req_duration:      ['p(95)<5000'],     // 95th pct < 5s
    http_req_duration:      ['p(99)<8000'],     // 99th pct < 8s
    error_rate:             ['rate<0.05'],
    compile_duration_ms:    ['p(95)<6000'],
    ai_insights_duration_ms:['p(95)<9000'],
  },
};

/* ── Helpers ─────────────────────────────────────────────────── */
const JSON_HEADERS = { headers: { 'Content-Type': 'application/json' } };

function randomLang() {
  return ['python', 'cpp', 'java', 'javascript'][Math.floor(Math.random() * 4)];
}

const CODE_SAMPLES = {
  python:     'def fib(n):\n    return n if n<=1 else fib(n-1)+fib(n-2)\nprint(fib(10))',
  cpp:        '#include<iostream>\nusing namespace std;\nint main(){cout<<"Hello k6";return 0;}',
  java:       'public class Main{public static void main(String[] a){System.out.println("Hello k6");}}',
  javascript: 'const arr=[1,2,3,4,5];\nconsole.log(arr.reduce((a,b)=>a+b,0));',
};

/* ── Main VU Function ────────────────────────────────────────── */
export default function () {

  /* ── Group 1: Health & Stats ─────────────────────────────── */
  group('health_and_stats', () => {
    const health = http.get(`${BASE_URL}/api/health`);
    const healthOk = check(health, {
      'health: status 200':       (r) => r.status === 200,
      'health: json response':    (r) => r.headers['Content-Type']?.includes('application/json'),
      'health: duration < 400ms': (r) => r.timings.duration < 400,
    });
    if (!healthOk) apiErrors.add(1);
    errorRate.add(!healthOk);

    sleep(0.3);

    const stats = http.get(`${BASE_URL}/api/stats`);
    const statsOk = check(stats, {
      'stats: status 200':       (r) => r.status === 200,
      'stats: duration < 800ms': (r) => r.timings.duration < 800,
    });
    if (!statsOk) apiErrors.add(1);
    errorRate.add(!statsOk);
  });

  sleep(0.5);

  /* ── Group 2: Code Compilation ───────────────────────────── */
  group('compile_api', () => {
    const lang = randomLang();
    const payload = JSON.stringify({
      code:     CODE_SAMPLES[lang],
      language: lang,
      stdin:    '',
    });

    const res = http.post(`${BASE_URL}/api/compile`, payload, JSON_HEADERS);
    compileDuration.add(res.timings.duration);

    const ok = check(res, {
      'compile: status 200':       (r) => r.status === 200,
      'compile: has status field':  (r) => {
        try { return JSON.parse(r.body).hasOwnProperty('status'); } catch { return false; }
      },
      'compile: not 500 error':    (r) => r.status !== 500,
      'compile: duration < 6s':    (r) => r.timings.duration < 6000,
    });
    if (!ok) compileErrors.add(1);
    errorRate.add(!ok);
  });

  sleep(0.5);

  /* ── Group 3: AI Insights ────────────────────────────────── */
  group('ai_insights', () => {
    const payload = JSON.stringify({
      stats: {
        easy:   Math.floor(Math.random() * 100),
        medium: Math.floor(Math.random() * 150),
        hard:   Math.floor(Math.random() * 60),
        streak: Math.floor(Math.random() * 30),
      },
    });

    const res = http.post(`${BASE_URL}/api/ai/insights`, payload, JSON_HEADERS);
    aiDuration.add(res.timings.duration);

    const ok = check(res, {
      'ai/insights: status 200':        (r) => r.status === 200,
      'ai/insights: has weakness':      (r) => {
        try { return !!JSON.parse(r.body).weakness; } catch { return false; }
      },
      'ai/insights: duration < 9s':     (r) => r.timings.duration < 9000,
    });
    if (!ok) apiErrors.add(1);
    errorRate.add(!ok);
  });

  sleep(1);

  /* ── Group 4: Page Routes ────────────────────────────────── */
  group('page_routes', () => {
    const pages = ['/', '/workspace', '/placement', '/portfolio', '/uni-hub'];
    const page  = pages[Math.floor(Math.random() * pages.length)];

    const res = http.get(`${BASE_URL}${page}`);
    const ok = check(res, {
      [`page ${page}: status 200`]:   (r) => r.status === 200,
      [`page ${page}: has html`]:     (r) => r.body?.includes('<html') || r.body?.includes('<!DOCTYPE'),
      [`page ${page}: < 3s`]:         (r) => r.timings.duration < 3000,
    });
    if (!ok) apiErrors.add(1);
    errorRate.add(!ok);
  });

  sleep(Math.random() * 1 + 0.5); // random think time: 0.5–1.5s
}

/* ── Setup: Validate server is up ───────────────────────────── */
export function setup() {
  const res = http.get(`${BASE_URL}/api/health`);
  if (res.status !== 200) {
    throw new Error(`Server not reachable at ${BASE_URL} — got ${res.status}`);
  }
  console.log(`✓ Server reachable at ${BASE_URL}`);
}

/* ── Teardown: Summary ───────────────────────────────────────── */
export function teardown(data) {
  console.log('✓ Load test complete. Check metrics above.');
}
