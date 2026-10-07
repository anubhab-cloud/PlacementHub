'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Room, RoomMember, RoomMessage } from '@/lib/library/types';
import { createRoom, endStudySession, fetchRoomMessages, fetchRooms, getStorageMode, joinRoom, leaveRoom, sendRoomMessage, startStudySession } from '@/lib/library/room-engine';
import { subscribeToRoomRealtime, subscribeToRooms } from '@/lib/library/realtime';
import CreateRoomModal from '@/components/library/CreateRoomModal';
import HallChatPanel from '@/components/library/HallChatPanel';
import FocusTimerWidget from '@/components/library/FocusTimerWidget';
import TodaysGoalWidget from '@/components/library/TodaysGoalWidget';

type View = 'rooms' | 'my-rooms' | 'focus';
type Kind = 'all' | 'private' | 'coding' | 'interview';
type Connection = 'device' | 'shared' | 'connecting' | 'live' | 'offline';

export default function VirtualLibPage() {
  const { user } = useAuth();
  const userId = user?.email || '';
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [joined, setJoined] = useState(false);
  const [view, setView] = useState<View>('rooms');
  const [kind, setKind] = useState<Kind>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [connection, setConnection] = useState<Connection>('connecting');
  const unsubscribe = useRef<(() => void) | null>(null);

  const refreshRooms = useCallback(async () => {
    try {
      const result = await fetchRooms();
      setRooms(result);
      setConnection(getStorageMode());
      const sharedRoomId = new URLSearchParams(window.location.search).get('room');
      setActiveRoom((current) => (sharedRoomId ? result.find((room) => room.id === sharedRoomId) : null) || (current ? result.find((room) => room.id === current.id) || null : result.find((room) => room.privacy === 'public') || null));
      setError('');
    } catch {
      setConnection('device');
      setError('Could not load rooms. Check your connection and try again.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refreshRooms(); }, [refreshRooms]);

  useEffect(() => subscribeToRooms(() => { void refreshRooms(); }), [refreshRooms]);

  useEffect(() => {
    const onRooms = () => { void refreshRooms(); };
    const onBroadcast = (event: MessageEvent) => {
      if (event.data?.event === 'vlib_rooms_updated') onRooms();
      if (event.data?.event === 'vlib_messages_updated' && activeRoom) void fetchRoomMessages(activeRoom.id).then(setMessages);
    };
    window.addEventListener('vlib_rooms_updated', onRooms);
    const channel = 'BroadcastChannel' in window ? new BroadcastChannel('nexusprep-library') : null;
    channel?.addEventListener('message', onBroadcast);
    return () => { window.removeEventListener('vlib_rooms_updated', onRooms); channel?.close(); };
  }, [refreshRooms, activeRoom]);

  useEffect(() => {
    setJoined(false);
    setMembers([]);
    setMessages([]);
    if (!activeRoom) return;
    let alive = true;
    fetchRoomMessages(activeRoom.id).then((rows) => {
      if (alive) { setMessages(rows); if (getStorageMode() === 'device') setConnection('device'); }
    }).catch(() => setMessages([]));
    return () => { alive = false; unsubscribe.current?.(); unsubscribe.current = null; };
  }, [activeRoom?.id]);

  useEffect(() => {
    if (!joined || !activeRoom || !user) return;
    let alive = true;
    const stop = subscribeToRoomRealtime(activeRoom.id, { email: user.email, name: user.name || 'Student', avatar: user.avatar }, 'Focused study', false, false,
      (message) => setMessages((previous) => previous.some((item) => item.id === message.id) ? previous : [...previous, message]),
      (online) => {
        if (!alive) return;
        setMembers(online.map((person) => ({ id: person.user_id, room_id: activeRoom.id, user_id: person.user_id, user_name: person.user_name, user_avatar: person.user_avatar, role: 'member', topic: person.topic, camera_on: false, mic_on: false, hand_raised: false, joined_at: person.online_at, study_started_at: person.online_at })));
      }, () => {}, (connected) => setConnection(connected ? 'live' : 'offline'));
    unsubscribe.current = stop;
    return () => { alive = false; stop(); if (unsubscribe.current === stop) unsubscribe.current = null; };
  }, [joined, activeRoom, user]);

  useEffect(() => {
    const onMessages = () => { if (activeRoom) void fetchRoomMessages(activeRoom.id).then(setMessages); };
    window.addEventListener('vlib_messages_updated', onMessages);
    return () => { window.removeEventListener('vlib_messages_updated', onMessages); };
  }, [activeRoom, joined]);

  const visibleRooms = useMemo(() => rooms.filter((room) => {
    const isMine = room.owner_id === userId;
    if (view === 'my-rooms' && !isMine) return false;
    if (view !== 'my-rooms' && room.privacy === 'private' && !isMine) return false;
    if (kind !== 'all' && room.type !== kind) return false;
    return `${room.name} ${room.description} ${room.owner_name}`.toLowerCase().includes(query.toLowerCase());
  }), [rooms, view, kind, query, userId]);

  const handleJoin = async () => {
    if (!user) { setError('Sign in to join a study room.'); return; }
    if (!activeRoom) return;
    setConnection(process.env.NEXT_PUBLIC_SUPABASE_URL ? 'connecting' : 'device');
    try {
      const member = await joinRoom(activeRoom.id, { name: user.name || 'Student', avatar: user.avatar, email: user.email }, 'Focused study');
      if (getStorageMode() === 'device') setConnection('offline');
      setMembers([member]);
      setJoined(true);
      startStudySession(activeRoom.id, activeRoom.name, user.email || '', 'Focused study');
      setError('');
    } catch (joinError) { setError(joinError instanceof Error ? joinError.message : 'Could not join this room. Please try again.'); }
  };

  const handleLeave = async () => {
    if (!activeRoom) return;
    if (userId) await leaveRoom(activeRoom.id, userId);
    unsubscribe.current?.(); unsubscribe.current = null;
    endStudySession(); setJoined(false); setMembers([]);
    setConnection('device');
  };

  const handleSend = async (text: string) => {
    if (!user || !activeRoom || !joined) { setError('Join the room before sending a message.'); return; }
    try {
      const message = await sendRoomMessage(activeRoom.id, { name: user.name || 'Student', avatar: user.avatar, email: user.email }, text);
      if (getStorageMode() === 'device') setConnection('offline');
      setMessages((previous) => previous.some((item) => item.id === message.id) ? previous : [...previous, message]);
      setError('');
    } catch { setError('Message could not be sent. Check the connection and retry.'); throw new Error('Message delivery failed'); }
  };

  const handleCreate = async (data: Parameters<typeof createRoom>[0]) => {
    try {
      const room = await createRoom({ ...data, owner_id: userId || 'local-user', owner_name: user?.name || 'You' });
      setConnection(getStorageMode());
      setRooms((current) => [room, ...current.filter((item) => item.id !== room.id)]);
      setActiveRoom(room); setView('my-rooms'); setCreateOpen(false); setNotice('Room created. Share it with your study group.'); setError('');
    } catch { setError('Could not create the room. Check your connection and try again.'); throw new Error('Room creation failed'); }
  };

  const copyRoomLink = async () => {
    if (!activeRoom) return;
    try {
      const link = new URL(window.location.href);
      link.searchParams.set('room', activeRoom.id);
      await navigator.clipboard.writeText(link.toString());
      setNotice(activeRoom.privacy === 'private' ? 'Room link copied. Share it with your group; room access depends on the same library storage being available to them.' : 'Room link copied.');
    } catch { setError('Could not copy the room link. Check your browser clipboard permissions.'); }
  };

  const tabs: { id: View; title: string; icon: string }[] = [
    { id: 'rooms', title: 'Discover rooms', icon: '⌕' },
    { id: 'my-rooms', title: 'My rooms', icon: '▣' },
    { id: 'focus', title: 'Focus desk', icon: '◷' },
  ];

  return <div className="vlib-page">
    <header className="vlib-topbar">
      <div><span className="vlib-eyebrow">NEXUSPREP · STUDY TOGETHER</span><h1>Virtual library</h1></div>
      <div className="vlib-top-actions"><span className={`vlib-connection status-${connection}`}><i /> {connection === 'live' ? 'Realtime connected' : connection === 'connecting' ? 'Connecting…' : connection === 'offline' ? 'Device mode' : connection === 'shared' ? 'Shared rooms' : 'This device'}</span><button className="vlib-primary" onClick={() => setCreateOpen(true)}>＋ Create room</button></div>
    </header>

    <section className="vlib-intro">
      <div><span className="vlib-eyebrow">YOUR SPACE TO FOCUS</span><h2>Make progress, together.</h2><p>Find a study group, join a focused room, or set up a quiet desk for your next sprint.</p></div>
      <div className="vlib-metrics"><div><b>{rooms.length}</b><span>rooms available</span></div><div><b>{joined ? members.length : '—'}</b><span>people in your room</span></div></div>
    </section>

    <div className="vlib-layout">
      <aside className="vlib-nav">
        <div className="vlib-nav-label">LIBRARY</div>
        {tabs.map((tab) => <button key={tab.id} className={view === tab.id ? 'is-active' : ''} onClick={() => setView(tab.id)}><span>{tab.icon}</span>{tab.title}{tab.id === 'my-rooms' && <small>{rooms.filter((room) => room.owner_id === userId).length}</small>}</button>)}
        <div className="vlib-nav-tip"><span>✦</span><b>Study tip</b><p>Set one small goal before starting your focus timer.</p></div>
      </aside>

      <section className="vlib-main">
        {view === 'focus' ? <div className="vlib-focus-view"><div className="vlib-section-heading"><div><span className="vlib-eyebrow">PERSONAL WORKSPACE</span><h2>Your focus desk</h2><p>A timer and a short checklist to keep your next session clear.</p></div></div><div className="vlib-focus-grid"><FocusTimerWidget userId={userId || 'local-user'} roomId={activeRoom?.id || 'personal-focus'} roomName={activeRoom?.name || 'Personal focus desk'} topic="Focused study"/><TodaysGoalWidget userId={userId || 'local-user'}/></div></div> : <>
          <div className="vlib-section-heading"><div><span className="vlib-eyebrow">{view === 'my-rooms' ? 'YOUR GROUPS' : 'STUDY SPACES'}</span><h2>{view === 'my-rooms' ? 'Rooms you created' : 'Find your study room'}</h2><p>{view === 'my-rooms' ? 'Manage and join your study groups.' : 'Choose a room by the kind of work you want to do.'}</p></div><label className="vlib-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search rooms" aria-label="Search rooms"/></label></div>
          <div className="vlib-filter-row">{([{ id: 'all', label: 'All rooms' }, { id: 'private', label: 'Study' }, { id: 'coding', label: 'Coding' }, { id: 'interview', label: 'Interview prep' }] as const).map((filter) => <button key={filter.id} className={kind === filter.id ? 'is-active' : ''} onClick={() => setKind(filter.id)}>{filter.label}<span>{filter.id === 'all' ? rooms.length : rooms.filter((room) => room.type === filter.id).length}</span></button>)}</div>
          {error && <div className="vlib-alert" role="alert">{error}<button onClick={() => setError('')} aria-label="Dismiss">×</button></div>}
          {notice && <div className="vlib-notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}
          {loading ? <div className="vlib-empty"><div className="vlib-loader"/><b>Loading rooms</b><p>Fetching the latest study spaces…</p></div> : visibleRooms.length === 0 ? <div className="vlib-empty"><div className="vlib-empty-icon">⌕</div><h3>{view === 'my-rooms' ? 'No rooms created yet' : 'No rooms match your search'}</h3><p>{view === 'my-rooms' ? 'Create a room and invite your classmates to study together.' : 'Try another search or create a room for your group.'}</p><button className="vlib-primary" onClick={() => setCreateOpen(true)}>＋ Create a room</button></div> : <div className="vlib-room-cards">{visibleRooms.map((room) => <button key={room.id} className={`vlib-room-card ${activeRoom?.id === room.id ? 'is-selected' : ''}`} onClick={() => setActiveRoom(room)}><div className="vlib-room-card-top"><span className={`vlib-room-icon type-${room.type}`}>{room.type === 'coding' ? '</>' : room.type === 'interview' ? '◎' : '✦'}</span><span className="vlib-room-kind">{room.type === 'private' ? 'STUDY ROOM' : `${room.type.toUpperCase()} ROOM`}</span><span className="vlib-room-lock">{room.privacy === 'private' ? 'Unlisted' : 'Open'}</span></div><h3>{room.name}</h3><p>{room.description || 'A shared space to make progress together.'}</p><div className="vlib-room-footer"><span>Created by {room.owner_name || 'a student'}</span><span>Up to {room.max_members} people <b>↗</b></span></div></button>)}</div>}
          {activeRoom && <section className="vlib-room-detail"><div className="vlib-room-detail-heading"><div><span className="vlib-eyebrow">ROOM DETAILS</span><h2>{activeRoom.name}</h2><p>{activeRoom.description || 'A shared space to make progress together.'}</p></div><div className="vlib-room-controls">{(activeRoom.owner_id === userId || activeRoom.privacy === 'public') && <button className="vlib-secondary" onClick={() => void copyRoomLink()}>↗ Share room</button>}{joined ? <button className="vlib-secondary" onClick={() => void handleLeave()}>Leave room</button> : <button className="vlib-primary" onClick={() => void handleJoin()}>{user ? 'Join this room' : 'Sign in to join'}</button>}</div></div><div className="vlib-room-status"><span className={joined ? 'vlib-status-live' : ''}><i/>{joined ? 'You are in this room' : 'Previewing room'}</span><span>{joined ? `${members.length} here now` : 'Join to see who is here and use chat'}</span><span>{activeRoom.privacy === 'private' ? 'Unlisted · share the room link to open' : 'Open to join'}</span></div></section>}
        </>}
      </section>
      {view !== 'focus' && activeRoom && <aside className="vlib-chat-shell"><div className="vlib-chat-title"><div><span className="vlib-eyebrow">ROOM CHAT</span><h3>{activeRoom.name}</h3></div><span className={`vlib-chat-count ${joined ? 'online' : ''}`}><i/>{joined ? 'Live' : 'Preview'}</span></div>{joined ? <HallChatPanel messages={messages} members={members} currentUserId={userId} currentUserName={user?.name || 'Student'} currentUserAvatar={user?.avatar || 'S'} onSendMessage={handleSend} roomId={activeRoom.id}/> : <div className="vlib-chat-gated"><span>✉</span><b>Chat with your group</b><p>Join this room to see messages and take part in the conversation.</p><button className="vlib-primary" onClick={() => void handleJoin()}>{user ? 'Join room' : 'Sign in to join'}</button></div>}</aside>}
    </div>
    <CreateRoomModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreateRoom={handleCreate}/>
  </div>;
}
