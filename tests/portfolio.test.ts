import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getPortfolio, POST as postPortfolio } from '@/app/api/portfolio/route';
import { signSessionToken } from '@/lib/auth';

describe('Dynamic Student Portfolio API (/api/portfolio)', () => {
  it('rejects GET /api/portfolio missing username query parameter with 400 Bad Request', async () => {
    const req = new NextRequest('http://localhost:3001/api/portfolio', {
      method: 'GET',
    });

    const res = await getPortfolio(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Username parameter is required');
  });

  it('returns default structured portfolio for any valid un-customized username', async () => {
    const req = new NextRequest('http://localhost:3001/api/portfolio?username=rahul-sharma', {
      method: 'GET',
    });

    const res = await getPortfolio(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.portfolio).toBeTruthy();
    expect(body.portfolio.name).toBe('Rahul Sharma');
    expect(body.portfolio.username).toBe('rahul-sharma');
    expect(body.portfolio.theme).toBe('cyberpunk');
  });

  it('rejects unauthenticated POST /api/portfolio with 401 Unauthorized', async () => {
    const req = new NextRequest('http://localhost:3001/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'rahul-sharma',
        name: 'Rahul Sharma',
        bio: 'Custom bio',
      }),
    });

    const res = await postPortfolio(req);
    expect(res.status).toBe(401);
  });

  it('updates and persists portfolio when authenticated, and reflects in GET', async () => {
    const token = signSessionToken({
      userId: 'usr_priya',
      email: 'priya.sharma@nexusprep.io',
      name: 'Priya Sharma',
    });

    const postReq = new NextRequest('http://localhost:3001/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: 'priya-sharma',
        name: 'Priya Sharma',
        bio: 'Full-Stack Developer & Competitive Programmer building scalable systems.',
        theme: 'corporate',
      }),
    });

    const postRes = await postPortfolio(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.portfolio.theme).toBe('corporate');

    // Retrieve via GET to verify persistence
    const getReq = new NextRequest('http://localhost:3001/api/portfolio?username=priya-sharma', {
      method: 'GET',
    });
    const getRes = await getPortfolio(getReq);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.found).toBe(true);
    expect(getData.portfolio.name).toBe('Priya Sharma');
    expect(getData.portfolio.bio).toContain('Competitive Programmer');
    expect(getData.portfolio.theme).toBe('corporate');
  });

  it('isolates different student profiles without cross-contamination', async () => {
    const getOtherReq = new NextRequest('http://localhost:3001/api/portfolio?username=arjun-verma', {
      method: 'GET',
    });
    const res = await getPortfolio(getOtherReq);
    const data = await res.json();
    expect(data.portfolio.name).toBe('Arjun Verma');
    expect(data.portfolio.username).toBe('arjun-verma');
    // Does not inherit Priya's custom bio
    expect(data.portfolio.bio).not.toContain('Priya');
  });
});
