import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'LeetCode username is required' }, { status: 400 });
    }

    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
            starRating
            userAvatar
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
      body: JSON.stringify({ query, variables: { username: username.trim() } }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const user = data?.data?.matchedUser;

    if (!user) {
      return NextResponse.json({ error: `User "${username}" not found on LeetCode` }, { status: 404 });
    }

    const stats = user.submitStats?.acSubmissionNum || [];
    const all = stats.find((s: any) => s.difficulty === 'All')?.count || 0;
    const easy = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const medium = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hard = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;

    return NextResponse.json({
      username: user.username,
      ranking: user.profile?.ranking || 'N/A',
      avatar: user.profile?.userAvatar,
      solved: {
        all,
        easy,
        medium,
        hard,
      },
    });
  } catch (err: any) {
    console.error('[leetcode/sync] error:', err);
    return NextResponse.json({ error: err.message || 'Failed to sync LeetCode profile' }, { status: 500 });
  }
}
