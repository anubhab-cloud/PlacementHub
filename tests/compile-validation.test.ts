import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/compile/route';
import { NextRequest } from 'next/server';

describe('Compilation Endpoint Request Validation (/api/compile)', () => {
  it('rejects requests missing code with 400 Bad Request', async () => {
    const req = new NextRequest('http://localhost:3001/api/compile', {
      method: 'POST',
      body: JSON.stringify({ language: 'cpp' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('code and language are required');
  });

  it('rejects requests missing language with 400 Bad Request', async () => {
    const req = new NextRequest('http://localhost:3001/api/compile', {
      method: 'POST',
      body: JSON.stringify({ code: 'int main() { return 0; }' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('code and language are required');
  });

  it('executes valid code natively and returns genuine output and metrics', async () => {
    const req = new NextRequest('http://localhost:3001/api/compile', {
      method: 'POST',
      body: JSON.stringify({ code: 'print("Hello 42")', language: 'python' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.status.id).toBe(3); // Accepted
    expect(data.status.description).toBe('Accepted');
    expect(data.stdout?.trim()).toBe('Hello 42');
    expect(data.time).toBeTruthy();
    expect(data.configured).toBe(true);
  });

  it('captures genuine compiler and runtime errors accurately', async () => {
    const req = new NextRequest('http://localhost:3001/api/compile', {
      method: 'POST',
      body: JSON.stringify({ code: 'int main( { return 0; }', language: 'cpp' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.status.id).toBe(6); // Compilation Error
    expect(data.status.description).toBe('Compilation Error');
    expect(data.compile_output).toBeTruthy();
  });
});
