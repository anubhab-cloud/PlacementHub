import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
    }

    const { token, username } = await req.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'GitHub Personal Access Token is required' }, { status: 400 });
    }

    const cleanToken = token.trim();
    const octokit = new Octokit({ auth: cleanToken });

    // Validate token against GitHub API
    let ghUser: any;
    try {
      const { data } = await octokit.users.getAuthenticated();
      ghUser = data;
    } catch (err: any) {
      return NextResponse.json({
        success: false,
        error: `GitHub validation failed: ${err.message}. Please verify the token is active with 'repo' scope.`,
      }, { status: 400 });
    }

    const confirmedUsername = username?.trim() || ghUser.login;

    // Update runtime environment
    process.env.GITHUB_TOKEN = cleanToken;
    process.env.GITHUB_USERNAME = confirmedUsername;

    // Update .env.local permanently
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
      }

      // Replace or append GITHUB_TOKEN
      if (envContent.includes('GITHUB_TOKEN=')) {
        envContent = envContent.replace(/GITHUB_TOKEN=.*/g, `GITHUB_TOKEN=${cleanToken}`);
      } else {
        envContent += `\nGITHUB_TOKEN=${cleanToken}`;
      }

      // Replace or append GITHUB_USERNAME
      if (envContent.includes('GITHUB_USERNAME=')) {
        envContent = envContent.replace(/GITHUB_USERNAME=.*/g, `GITHUB_USERNAME=${confirmedUsername}`);
      } else {
        envContent += `\nGITHUB_USERNAME=${confirmedUsername}`;
      }

      fs.writeFileSync(envPath, envContent, 'utf-8');
    } catch (fsErr) {
      console.warn('Could not write to .env.local:', fsErr);
    }

    return NextResponse.json({
      success: true,
      username: confirmedUsername,
      message: `✅ GitHub credentials verified and updated for ${confirmedUsername}!`,
    });

  } catch (err: any) {
    console.error('[github/token] error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update GitHub credentials' }, { status: 500 });
  }
}
