'use client';
import { useState, useEffect } from 'react';

type VideoItem = {
  id: string;
  duration: string;
  title: string;
  channel: string;
  url?: string;
};

const initialVideos: VideoItem[] = [
  { id: 'v1', duration: '2:14', title: 'DSA complete course', channel: 'Striver', url: 'https://youtube.com' },
  { id: 'v2', duration: '1:30', title: 'Dynamic programming', channel: 'take U forward', url: 'https://youtube.com' },
  { id: 'v3', duration: '58:22', title: 'System design primer', channel: 'Gaurav Sen', url: 'https://youtube.com' },
];

export default function RecentVideosWidget() {
  const [videoList, setVideoList] = useState<VideoItem[]>(initialVideos);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nexusprep_videos');
    if (saved) {
      try {
        setVideoList(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveVideos = (vids: VideoItem[]) => {
    setVideoList(vids);
    localStorage.setItem('nexusprep_videos', JSON.stringify(vids));
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newVid: VideoItem = {
      id: 'v_' + Date.now(),
      title: title.trim(),
      channel: channel.trim() || 'YouTube',
      duration: duration.trim() || '15:00',
    };
    saveVideos([newVid, ...videoList]);
    setTitle('');
    setChannel('');
    setDuration('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    saveVideos(videoList.filter(v => v.id !== id));
  };

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="widget-icon-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <span className="widget-title">Recent videos</span>
        <button className="widget-add-btn" onClick={() => setShowAddModal(true)}>Pin</button>
      </div>

      <div className="recent-videos-list">
        {videoList.length === 0 ? (
          <div style={{ fontSize: '12px', color: '#6B7280', padding: '10px 0', textAlign: 'center' }}>No videos pinned yet.</div>
        ) : (
          videoList.map((v) => (
            <div className="video-row-item" key={v.id}>
              <div className="video-thumb-box">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span className="video-duration">{v.duration}</span>
              </div>
              <div className="video-info-box" style={{ flex: 1 }}>
                <div className="video-title-text">{v.title}</div>
                <div className="video-channel-text">{v.channel}</div>
              </div>
              <button
                onClick={() => handleDelete(v.id)}
                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '12px', opacity: 0.6 }}
                title="Remove video"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleAddVideo} className="dashboard-widget-card" style={{ width: '320px', padding: '20px', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#fff' }}>Pin Study Video</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Video Title</label>
              <input
                type="text"
                placeholder="e.g. Graph Algorithms Crash Course"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Channel / Creator</label>
                <input
                  type="text"
                  placeholder="e.g. NeetCode"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 12:45"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" className="warmup-btn-dark" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="warmup-btn-purple">Pin Video</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

