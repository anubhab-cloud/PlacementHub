import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { supabase } from './supabase';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role?: string;
  provider?: string;
  iat?: number;
  exp?: number;
}

const SESSION_COOKIE_NAME = 'placementhub_session';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecretKey(): string {
  // Use explicit secret or stable server-derived fallback
  return (
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.GITHUB_TOKEN ||
    'placementhub-production-secure-hmac-salt-key-2025'
  );
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token
 */
export function signSessionToken(payload: Omit<AuthSession, 'iat' | 'exp'>): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_TTL_SECONDS;
  const fullPayload: AuthSession = { ...payload, iat, exp };

  const dataStr = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecretKey())
    .update(dataStr)
    .digest('base64url');

  return `${dataStr}.${signature}`;
}

/**
 * Verifies HMAC-SHA256 signature and expiration
 */
export function verifySessionToken(token: string): AuthSession | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [dataStr, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', getSecretKey())
      .update(dataStr)
      .digest('base64url');

    // Timing-safe comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payloadStr = Buffer.from(dataStr, 'base64url').toString('utf-8');
    const payload: AuthSession = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the authenticated user from a Request.
 * Checks:
 * 1. Authorization: Bearer <token>
 * 2. Cookie: placementhub_session
 * 3. Supabase Auth JWT (if Supabase is configured)
 */
export async function getAuthenticatedUser(req: NextRequest | Request): Promise<AuthSession | null> {
  // 1. Check Authorization header
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  let bearerToken: string | null = null;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    bearerToken = authHeader.slice(7).trim();
  }

  // 2. Check cookies
  let cookieToken: string | null = null;
  if ('cookies' in req && typeof (req as any).cookies?.get === 'function') {
    cookieToken = (req as NextRequest).cookies.get(SESSION_COOKIE_NAME)?.value || null;
  } else {
    const rawCookies = req.headers.get('cookie') || '';
    const match = rawCookies.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
    if (match) {
      cookieToken = decodeURIComponent(match[1]);
    }
  }

  const tokenToVerify = bearerToken || cookieToken;

  // Verify against our signed session token
  if (tokenToVerify) {
    const session = verifySessionToken(tokenToVerify);
    if (session) {
      return session;
    }
  }

  // 3. If Supabase is active, verify via Supabase Auth
  if (supabase && tokenToVerify) {
    try {
      const { data, error } = await supabase.auth.getUser(tokenToVerify);
      if (!error && data?.user) {
        return {
          userId: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || (data.user.email ? data.user.email.split('@')[0] : 'User'),
          role: data.user.role,
        };
      }
    } catch {
      // Supabase verification failed or unavailable
    }
  }

  return null;
}

export { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS };
