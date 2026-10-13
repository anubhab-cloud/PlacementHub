import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  signSessionToken,
  getAuthenticatedUser,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from '@/lib/auth';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'ST';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// GET /api/auth/session — returns current authenticated session
export async function GET(req: NextRequest) {
  const session = await getAuthenticatedUser(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      email: session.email,
      name: session.name,
      avatar: getInitials(session.name),
      role: session.role || 'SDE Aspirant',
    },
  });
}

// POST /api/auth/session — creates a verified session cookie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const rawName = (body.name || '').trim();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }

    const name = rawName || email.split('@')[0];
    const userId = crypto.createHash('sha256').update(email).digest('hex').slice(0, 16);

    const sessionPayload = {
      userId,
      email,
      name,
      role: body.role || 'SDE Aspirant',
      provider: body.provider || 'email',
    };

    const token = signSessionToken(sessionPayload);
    const initials = getInitials(name);

    const response = NextResponse.json({
      success: true,
      user: {
        userId,
        email,
        name,
        avatar: initials,
        role: sessionPayload.role,
      },
      token,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to initialize session' }, { status: 500 });
  }
}
