import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room') || 'community-hall-1';
  const username = searchParams.get('username') || 'Student';

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://placementhub-demo.livekit.cloud';

  if (!apiKey || !apiSecret) {
    return NextResponse.json({
      token: `mock_jwt_token_${room}_${encodeURIComponent(username)}_${Date.now()}`,
      wsUrl,
      configured: false,
      message: 'LiveKit server credentials pending in .env. Falling back to local WebRTC/Avatar mode.',
    });
  }

  try {
    // Dynamic import to prevent build failure when livekit-server-sdk is not pre-installed
    const livekitModule = 'livekit-server-sdk';
    const { AccessToken } = await import(/* webpackIgnore: true */ livekitModule);
    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
      ttl: '2h',
    });

    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      wsUrl,
      configured: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      token: `mock_jwt_token_${room}_${encodeURIComponent(username)}_${Date.now()}`,
      wsUrl,
      configured: false,
      message: 'LiveKit SDK not installed yet. Operating in local WebRTC/Avatar fallback mode.',
    });
  }
}
