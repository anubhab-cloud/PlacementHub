/**
 * PlacementHub — k6 Smoke Test
 * ─────────────────────────────
 * Purpose : Verify all endpoints are alive with minimal load (1 VU, 1 iteration).
 * Run     : k6 run k6/smoke.test.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const errorRate = new Rate('errors');

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed:   ['rate<0.01'],     // <1% failures
    http_req_duration: ['p(95)<3000'],    // 95th percentile under 3s
    errors:            ['rate<0.01'],
  },
};

export default function () {
  /* ── 1. Health Check ─────────────────────────────────────── */
  {
    const res = http.get(`${BASE_URL}/api/health`);
    const ok = check(res, {
      '[health] status 200':           (r) => r.status === 200,
      '[health] returns json':         (r) => r.headers['Content-Type']?.includes('application/json'),
      '[health] has judge0 field':     (r) => JSON.parse(r.body).hasOwnProperty('judge0'),
      '[health] has gemini field':     (r) => JSON.parse(r.body).hasOwnProperty('gemini'),
      '[health] response < 2000ms':    (r) => r.timings.duration < 2000,
    });
    errorRate.add(!ok);
  }

  sleep(0.5);

  /* ── 2. Stats API ─────────────────────────────────────────── */
  {
    const res = http.get(`${BASE_URL}/api/stats`);
    const ok = check(res, {
      '[stats] status 200':        (r) => r.status === 200,
      '[stats] returns json':      (r) => r.headers['Content-Type']?.includes('application/json'),
      '[stats] response < 800ms':  (r) => r.timings.duration < 800,
    });
    errorRate.add(!ok);
  }

  sleep(0.5);

  /* ── 3. Compile API (POST) ────────────────────────────────── */
  {
    const payload = JSON.stringify({
      code:     'print("Hello from k6!")',
      language: 'python',
      stdin:    '',
    });
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(`${BASE_URL}/api/compile`, payload, params);
    const ok = check(res, {
      '[compile] status 200':           (r) => r.status === 200,
      '[compile] has status field':     (r) => JSON.parse(r.body).hasOwnProperty('status'),
      '[compile] response < 5000ms':    (r) => r.timings.duration < 5000,
    });
    errorRate.add(!ok);
  }

  sleep(0.5);

  /* ── 4. AI Insights API (POST) ───────────────────────────── */
  {
    const payload = JSON.stringify({
      stats: { easy: 90, medium: 110, hard: 45, streak: 21 },
    });
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(`${BASE_URL}/api/ai/insights`, payload, params);
    const ok = check(res, {
      '[ai/insights] status 200':       (r) => r.status === 200,
      '[ai/insights] has weakness':     (r) => JSON.parse(r.body).hasOwnProperty('weakness'),
      '[ai/insights] response < 8000ms':(r) => r.timings.duration < 8000,
    });
    errorRate.add(!ok);
  }

  sleep(0.5);

  /* ── 5. Page Routes ──────────────────────────────────────── */
  const pages = ['/', '/workspace', '/placement', '/portfolio', '/uni-hub', '/settings'];
  for (const page of pages) {
    const res = http.get(`${BASE_URL}${page}`);
    const ok = check(res, {
      [`[page ${page}] status 200`]:      (r) => r.status === 200,
      [`[page ${page}] has html`]:        (r) => r.body?.includes('<!DOCTYPE html') || r.body?.includes('<html'),
      [`[page ${page}] < 3000ms`]:        (r) => r.timings.duration < 3000,
    });
    errorRate.add(!ok);
    sleep(0.3);
  }
}
