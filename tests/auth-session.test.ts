import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { signSessionToken, verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { GET as getSession, POST as postSession } from '@/app/api/auth/session/route';

describe('Server Authentication & Session Token Handling (lib/auth)', () => {
  const sampleUser = {
    userId: 'usr_test_123',
    email: 'student@example.com',
    name: 'Alex Johnson',
    role: 'SDE Aspirant',
  };

  it('signs and verifies a valid HMAC-SHA256 session token', () => {
    const token = signSessionToken(sampleUser);
    expect(typeof token).toBe('string');
    expect(token).toContain('.');

    const verified = verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(sampleUser.userId);
    expect(verified?.email).toBe(sampleUser.email);
    expect(verified?.name).toBe(sampleUser.name);
    expect(verified?.role).toBe(sampleUser.role);
    expect(verified?.exp).toBeGreaterThan(Date.now() / 1000);
  });

  it('rejects tampered or corrupted session tokens', () => {
    const token = signSessionToken(sampleUser);
    const [payload, sig] = token.split('.');
    // Corrupt payload
    const tamperedToken = `${payload}x.${sig}`;
    expect(verifySessionToken(tamperedToken)).toBeNull();

    // Corrupt signature
    const badSigToken = `${payload}.${sig.slice(0, -3)}abc`;
    expect(verifySessionToken(badSigToken)).toBeNull();

    // Empty or malformed tokens
    expect(verifySessionToken('')).toBeNull();
    expect(verifySessionToken('invalid-token')).toBeNull();
  });
});

describe('Session API Endpoints (/api/auth/session)', () => {
  it('returns 400 Bad Request when creating session with missing or invalid email', async () => {
    const req = new NextRequest('http://localhost:3001/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', name: 'Test' }),
    });

    const res = await postSession(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('valid email');
  });

  it('creates verified session, returns user and issues secure cookie on valid email', async () => {
    const req = new NextRequest('http://localhost:3001/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'jane.dev@nexusprep.io', name: 'Jane Dev' }),
    });

    const res = await postSession(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.user.name).toBe('Jane Dev');
    expect(body.user.email).toBe('jane.dev@nexusprep.io');
    expect(body.user.avatar).toBe('JD');
    expect(body.token).toBeTruthy();

    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain(SESSION_COOKIE_NAME);
  });

  it('returns 401 Unauthorized on GET /api/auth/session when no session exists', async () => {
    const req = new NextRequest('http://localhost:3001/api/auth/session', {
      method: 'GET',
    });

    const res = await getSession(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.authenticated).toBe(false);
  });

  it('returns 200 and authenticated user on GET /api/auth/session with valid Bearer token', async () => {
    const token = signSessionToken({
      userId: 'usr_jane_100',
      email: 'jane@example.com',
      name: 'Jane Doe',
    });

    const req = new NextRequest('http://localhost:3001/api/auth/session', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await getSession(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.authenticated).toBe(true);
    expect(body.user.email).toBe('jane@example.com');
    expect(body.user.name).toBe('Jane Doe');
  });
});
