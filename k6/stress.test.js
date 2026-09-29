/**
 * PlacementHub — k6 Stress Test
 * ────────────────────────────────
 * Purpose : Find the breaking point — ramp to 50 VUs and watch what fails.
 * Stages  :
 *   0→20 VUs (30s)  → 20→40 VUs (30s) → 40→50 VUs (30s)
 *   50 VUs for 1m   (peak load)
 *   50→0 VUs (20s)  (cool-down)
 * Run     : k6 run k6/stress.test.js
 */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const errorRate   = new Rate('error_rate');
export const failedReqs  = new Counter('failed_requests');
export const compileP95  = new Trend('compile_p95_ms', true);

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '30s', target: 40 },
    { duration: '30s', target: 50 },
    { duration: '1m',  target: 50 },  // peak
    { duration: '20s', target: 0  },  // cool-down
  ],
  thresholds: {
    http_req_failed:   ['rate<0.10'],   // allow up to 10% failure under stress
    http_req_duration: ['p(95)<8000'],  // 8s ceiling at stress
    error_rate:        ['rate<0.10'],
  },
};

const JSON_HDR = { headers: { 'Content-Type': 'application/json' } };

export default function () {

  /* ── Health (lightest endpoint — should always hold) ───── */
  group('health', () => {
    const r = http.get(`${BASE_URL}/api/health`);
    const ok = check(r, {
      'health 200': (r) => r.status === 200,
      'health <500ms': (r) => r.timings.duration < 500,
    });
    if (!ok) { failedReqs.add(1); errorRate.add(1); }
    else errorRate.add(0);
  });

  sleep(0.2);

  /* ── Compile (most expensive — CPU + external API) ─────── */
  group('compile_stress', () => {
    const bodies = [
      { code: 'print("stress")', language: 'python' },
      { code: '#include<iostream>\nusing namespace std;\nint main(){int s=0;for(int i=0;i<1000;i++)s+=i;cout<<s;}', language: 'cpp' },
      { code: 'console.log([...Array(10)].map((_,i)=>i*i).join(","))', language: 'javascript' },
    ];
    const body = bodies[Math.floor(Math.random() * bodies.length)];
    const r = http.post(`${BASE_URL}/api/compile`, JSON.stringify(body), JSON_HDR);
    compileP95.add(r.timings.duration);
    const ok = check(r, {
      'compile: not 500': (r) => r.status !== 500,
      'compile: has body': (r) => r.body?.length > 0,
    });
    if (!ok) { failedReqs.add(1); errorRate.add(1); }
    else errorRate.add(0);
  });

  sleep(0.3);

  /* ── Stats (read endpoint — should be fast even under load) */
  group('stats_stress', () => {
    const r = http.get(`${BASE_URL}/api/stats`);
    const ok = check(r, {
      'stats: 200': (r) => r.status === 200,
      'stats: <1s':  (r) => r.timings.duration < 1000,
    });
    if (!ok) { failedReqs.add(1); errorRate.add(1); }
    else errorRate.add(0);
  });

  sleep(0.5 + Math.random() * 0.5);
}

export function setup() {
  const res = http.get(`${BASE_URL}/api/health`);
  if (res.status !== 200) throw new Error(`Server unreachable at ${BASE_URL}`);
  console.log(`✓ Stress test starting against ${BASE_URL}`);
}
