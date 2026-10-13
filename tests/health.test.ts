import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/health/route';

describe('Health Check Endpoint (/api/health)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('correctly reports missing services when environment variables are unset', async () => {
    delete process.env.JUDGE0_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_USERNAME;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      judge0: false,
      gemini: false,
      github: false,
      supabase: false,
    });
  });

  it('correctly reports active services when environment variables are set', async () => {
    process.env.JUDGE0_API_KEY = 'test_judge0_key';
    process.env.GEMINI_API_KEY = 'test_gemini_key';
    process.env.GITHUB_TOKEN = 'test_token';
    process.env.GITHUB_USERNAME = 'test_user';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_anon_key';

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      judge0: true,
      gemini: true,
      github: true,
      supabase: true,
    });
  });
});
