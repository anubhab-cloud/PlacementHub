import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export interface PortfolioProfile {
  username: string;
  name: string;
  bio: string;
  theme: 'cyberpunk' | 'stark' | 'corporate';
  role?: string;
  githubUrl?: string;
  stats?: {
    solved?: string;
    commits?: string;
    streak?: string;
    accuracyTopic?: string;
  };
  updatedAt: string;
}

// In-memory persistent cache for portfolios across sessions
const portfolioRegistry = new Map<string, PortfolioProfile>();

function deriveDefaultProfile(handle: string): PortfolioProfile {
  const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const name = cleanHandle
    .split(/[-_]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Student Portfolio';

  return {
    username: cleanHandle,
    name,
    bio: 'Computer Science Student · Full-stack developer passionate about DSA, AI & System Architecture.',
    theme: 'cyberpunk',
    role: 'Computer Science & Engineering Student · DSA & Full-Stack Developer',
    githubUrl: 'https://github.com',
    stats: {
      solved: '245 / 300',
      commits: '85 Solutions',
      streak: '21 Days 🔥',
      accuracyTopic: 'Dynamic Programming',
    },
    updatedAt: new Date().toISOString(),
  };
}

// GET /api/portfolio?username=devika-rao
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUsername = searchParams.get('username');

  if (!rawUsername) {
    return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
  }

  const handle = rawUsername.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

  // 1. Check in-memory registry
  if (portfolioRegistry.has(handle)) {
    return NextResponse.json({ found: true, portfolio: portfolioRegistry.get(handle) });
  }

  // 2. If Supabase is configured, check users table
  if (supabase) {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('username', handle)
        .single();

      if (data && data.layout_config?.portfolio) {
        const profile: PortfolioProfile = {
          username: handle,
          name: data.username,
          bio: data.layout_config.portfolio.bio || '',
          theme: data.layout_config.portfolio.theme || 'cyberpunk',
          role: data.layout_config.portfolio.role,
          githubUrl: data.layout_config.portfolio.githubUrl || 'https://github.com',
          stats: {
            solved: `${data.streak || 245} / 300`,
            commits: `${data.github_pushes || 85} Solutions`,
            streak: `${data.streak || 21} Days 🔥`,
            accuracyTopic: 'Dynamic Programming',
          },
          updatedAt: data.created_at || new Date().toISOString(),
        };
        portfolioRegistry.set(handle, profile);
        return NextResponse.json({ found: true, portfolio: profile });
      }
    } catch {
      // Fallback to default derived profile
    }
  }

  // 3. Fallback: return derived profile for any valid handle
  const defaultProfile = deriveDefaultProfile(handle);
  return NextResponse.json({ found: false, portfolio: defaultProfile });
}

// POST /api/portfolio — updates or creates student portfolio (requires auth)
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Sign in required to save portfolio' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawUsername = body.username || session.name.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const handle = rawUsername.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    if (!handle) {
      return NextResponse.json({ error: 'Valid username handle is required' }, { status: 400 });
    }

    const profile: PortfolioProfile = {
      username: handle,
      name: body.name?.trim() || session.name,
      bio: body.bio?.trim() || 'Computer Science Student passionate about engineering.',
      theme: ['cyberpunk', 'stark', 'corporate'].includes(body.theme) ? body.theme : 'cyberpunk',
      role: body.role || 'Computer Science & Engineering Student · DSA & Full-Stack Developer',
      githubUrl: body.githubUrl || 'https://github.com',
      stats: body.stats || {
        solved: '245 / 300',
        commits: '85 Solutions',
        streak: '21 Days 🔥',
        accuracyTopic: 'Dynamic Programming',
      },
      updatedAt: new Date().toISOString(),
    };

    // Store in registry
    portfolioRegistry.set(handle, profile);

    // If Supabase is configured, persist to database
    if (supabase) {
      try {
        await supabase
          .from('users')
          .update({
            username: handle,
            layout_config: { portfolio: profile },
          })
          .eq('id', session.userId);
      } catch (err) {
        console.warn('Supabase portfolio update skipped:', err);
      }
    }

    return NextResponse.json({ success: true, portfolio: profile });

  } catch (err: any) {
    console.error('[portfolio] error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update portfolio' }, { status: 500 });
  }
}
