'use client';

const videos = [
  {
    id: 'v1', title: 'DSA Complete Course — All Patterns',
    channel: 'Striver', duration: '2:14:30',
    thumb: 'https://img.youtube.com/vi/rZ41y93P2Qo/mqdefault.jpg',
  },
  {
    id: 'v2', title: 'Dynamic Programming — All 40 Questions',
    channel: 'take U forward', duration: '1:30:45',
    thumb: 'https://img.youtube.com/vi/tyB0ztf0DNY/mqdefault.jpg',
  },
  {
    id: 'v3', title: 'System Design Primer for SDE Interviews',
    channel: 'Gaurav Sen', duration: '58:22',
    thumb: 'https://img.youtube.com/vi/xpDnVSmNFX0/mqdefault.jpg',
  },
];

export default function RecentVideosWidget() {
  return (
    <div className="card videos-widget">
      <div className="card-header">
        <span className="card-label"><span className="lbl-icon">📺</span> Recent Videos</span>
        <button className="btn btn-ghost btn-xs" id="btn-pin-playlist" style={{ borderRadius: '100px' }}>
          📌 Pin
        </button>
      </div>
      <div className="card-body">
        <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Pinned Learning
        </div>
        {videos.map(v => (
          <div className="vid-row" key={v.id} id={`video-${v.id}`}>
            <div className="vid-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.thumb}
                alt={v.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  if (el.parentElement) el.parentElement.style.background = 'linear-gradient(135deg,#0f0f23,#1a0a2e)';
                }}
              />
              {/* Play overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.25)',
              }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '4px',
                  background: '#ef4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '7px', color: 'white',
                }}>▶</div>
              </div>
              {/* Duration */}
              <div style={{
                position: 'absolute', bottom: '2px', right: '3px',
                fontSize: '8px', background: 'rgba(0,0,0,0.85)', color: 'white',
                padding: '1px 4px', borderRadius: '3px', fontFamily: 'monospace',
              }}>{v.duration}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="vid-title">{v.title}</div>
              <div className="vid-meta">{v.channel}</div>
            </div>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" id="btn-view-all-videos"
          style={{ width: '100%', justifyContent: 'center', marginTop: '8px', borderRadius: '100px' }}>
          View All Playlists →
        </button>
      </div>
    </div>
  );
}
