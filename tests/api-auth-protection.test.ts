import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { signSessionToken } from '@/lib/auth';
import { POST as postGithubPush } from '@/app/api/github/push/route';
import { GET as getStats, POST as postStats } from '@/app/api/stats/route';
import { POST as postAiChat } from '@/app/api/ai/chat/route';
import { POST as postAiInsights } from '@/app/api/ai/insights/route';

describe('Protected API Routes Enforce Server-Side Authentication', () => {
  const validToken = signSessionToken({
    userId: 'usr_valid_tester',
    email: 'tester@nexusprep.io',
    name: 'Test Student',
    role: 'SDE Aspirant',
  });

  describe('/api/github/push', () => {
    it('rejects unauthenticated requests with HTTP 401 Unauthorized', async () => {
      const req = new NextRequest('http://localhost:3001/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'print("hello")',
          language: 'python',
          problemTitle: 'Two Sum',
        }),
      });

      const res = await postGithubPush(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('Unauthorized');
    });

    it('allows authenticated requests with valid session token', async () => {
      const req = new NextRequest('http://localhost:3001/api/github/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validToken}`,
        },
        body: JSON.stringify({
          code: 'print("hello")',
          language: 'python',
          problemTitle: 'Two Sum',
        }),
      });

      const res = await postGithubPush(req);
      // Passes session authentication (does not return 401 Unauthorized for session)
      const data = await res.json();
      expect(data.error).toBeUndefined();
      expect(data.message).toBeTruthy();
    });
  });

  describe('/api/stats', () => {
    it('rejects unauthenticated GET /api/stats with HTTP 401 Unauthorized', async () => {
      const req = new NextRequest('http://localhost:3001/api/stats', {
        method: 'GET',
      });

      const res = await getStats(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('Unauthorized');
    });

    it('returns stats for authenticated user on GET /api/stats', async () => {
      const req = new NextRequest('http://localhost:3001/api/stats', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      const res = await getStats(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.userId).toBe('usr_valid_tester');
      expect(data.name).toBe('Test Student');
    });

    it('rejects unauthenticated POST /api/stats with HTTP 401 Unauthorized', async () => {
      const req = new NextRequest('http://localhost:3001/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streak: 10 }),
      });

      const res = await postStats(req);
      expect(res.status).toBe(401);
    });

    it('allows authenticated POST /api/stats', async () => {
      const req = new NextRequest('http://localhost:3001/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validToken}`,
        },
        body: JSON.stringify({ streak: 10 }),
      });

      const res = await postStats(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe('/api/ai/chat', () => {
    it('rejects unauthenticated POST /api/ai/chat with HTTP 401 Unauthorized', async () => {
      const req = new NextRequest('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'How do I solve BFS?' }),
      });

      const res = await postAiChat(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('Unauthorized');
    });

    it('allows authenticated POST /api/ai/chat and returns response personalized to student', async () => {
      const customToken = signSessionToken({
        userId: 'usr_rohit',
        email: 'rohit@nexusprep.io',
        name: 'Rohit Sharma',
      });

      const req = new NextRequest('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customToken}`,
        },
        body: JSON.stringify({ message: 'What should I study today?' }),
      });

      const res = await postAiChat(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.reply).toBeTruthy();
      // Should address Rohit, not hardcoded Anubhab
      expect(data.reply).toContain('Rohit Sharma');
    });
  });

  describe('/api/ai/insights', () => {
    it('rejects unauthenticated POST /api/ai/insights with HTTP 401 Unauthorized', async () => {
      const req = new NextRequest('http://localhost:3001/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await postAiInsights(req);
      expect(res.status).toBe(401);
    });

    it('allows authenticated POST /api/ai/insights', async () => {
      const req = new NextRequest('http://localhost:3001/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validToken}`,
        },
        body: JSON.stringify({}),
      });

      const res = await postAiInsights(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.weakness || data.recommended).toBeTruthy();
    });
  });
});
