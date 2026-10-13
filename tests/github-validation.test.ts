import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/github/push/route';
import { NextRequest } from 'next/server';
import { signSessionToken } from '@/lib/auth';

describe('GitHub Push Endpoint Request Validation (/api/github/push)', () => {
  it('rejects requests missing required parameters with 400 Bad Request', async () => {
    const token = signSessionToken({
      userId: 'test-user',
      email: 'test@nexusprep.io',
      name: 'Test Student',
    });

    const req = new NextRequest('http://localhost:3001/api/github/push', {
      method: 'POST',
      body: JSON.stringify({ code: 'const x = 1;' }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('code, language, problemTitle are required');
  });

  it('returns 503 Service Unavailable with honest unconfigured message when GITHUB_TOKEN is missing', async () => {
    const originalToken = process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_TOKEN;

    try {
      const token = signSessionToken({
        userId: 'test-user',
        email: 'test@nexusprep.io',
        name: 'Test Student',
      });

      const req = new NextRequest('http://localhost:3001/api/github/push', {
        method: 'POST',
        body: JSON.stringify({
          code: 'const x = 1;',
          language: 'javascript',
          problemTitle: 'Two Sum',
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await POST(req);
      expect(res.status).toBe(503);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.configured).toBe(false);
      expect(data.message).toContain('unconfigured');
    } finally {
      if (originalToken !== undefined) {
        process.env.GITHUB_TOKEN = originalToken;
      }
    }
  });
});
