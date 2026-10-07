import { supabase } from '../supabase';
import { Room, RoomCapabilities, RoomMember, RoomMessage, RoomType, StudySession } from './types';

const keys = {
  rooms: 'placementhub_vlib_rooms_v2',
  messages: 'placementhub_vlib_messages_v2',
  members: 'placementhub_vlib_members_v2',
  sessions: 'placementhub_vlib_sessions_v2',
};
let usingSharedStorage = false;
export function getStorageMode(): 'shared' | 'device' { return usingSharedStorage ? 'shared' : 'device'; }

export function getDefaultCapabilities(type: RoomType): RoomCapabilities {
  return {
    camera: false,
    voice: false,
    chat: true,
    screen_share: false,
    coding: type === 'coding' || type === 'interview',
    whiteboard: false,
    ask_to_talk: false,
  };
}

function readStore<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}

function writeStore(key: string, value: unknown, event: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(event));
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('nexusprep-library');
    channel.postMessage({ event });
    channel.close();
  }
}

function mergeRows<T extends { id: string }>(remote: T[], local: T[]): T[] {
  const byId = new Map(local.map((row) => [row.id, row]));
  remote.forEach((row) => byId.set(row.id, row));
  return [...byId.values()];
}

export async function fetchRooms(): Promise<Room[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('rooms').select('*').order('created_at', { ascending: false });
      if (!error && data) { usingSharedStorage = true; return mergeRows(data as Room[], readStore<Room[]>(keys.rooms, [])); }
      usingSharedStorage = false;
      console.warn('Library is using this device because the room service is unavailable.', error);
    } catch (error) { usingSharedStorage = false; console.warn('Library is using this device because the room service is unavailable.', error); }
  } else usingSharedStorage = false;
  return readStore<Room[]>(keys.rooms, []);
}

export async function fetchRoom(roomId: string): Promise<Room | null> {
  return (await fetchRooms()).find((room) => room.id === roomId) || null;
}

export async function createRoom(input: Partial<Room>): Promise<Room> {
  const type = input.type || 'private';
  const room: Room = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `room-${Date.now()}`,
    name: input.name?.trim() || 'Study room',
    description: input.description?.trim() || '',
    type,
    owner_id: input.owner_id || 'local-user',
    owner_name: input.owner_name || 'You',
    privacy: input.privacy || 'public',
    max_members: input.max_members || 12,
    capabilities: input.capabilities || getDefaultCapabilities(type),
    topic_distribution: {},
    active_students_count: 0,
    created_at: new Date().toISOString(),
  };
  if (supabase) {
    try {
      const { data, error } = await supabase.from('rooms').insert(room).select().single();
      if (!error && data) {
        usingSharedStorage = true;
        window.dispatchEvent(new Event('vlib_rooms_updated'));
        return data as Room;
      }
      usingSharedStorage = false;
      console.warn('Room was saved on this device because the room service is unavailable.', error);
    } catch (error) { usingSharedStorage = false; console.warn('Room was saved on this device because the room service is unavailable.', error); }
  } else usingSharedStorage = false;
  writeStore(keys.rooms, [room, ...readStore<Room[]>(keys.rooms, [])], 'vlib_rooms_updated');
  return room;
}

export async function fetchRoomMembers(roomId: string): Promise<RoomMember[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('room_members').select('*').eq('room_id', roomId);
      if (!error && data) return mergeRows(data as RoomMember[], readStore<Record<string, RoomMember[]>>(keys.members, {})[roomId] || []);
    } catch { /* Use the local copy while offline. */ }
  }
  return readStore<Record<string, RoomMember[]>>(keys.members, {})[roomId] || [];
}

export async function joinRoom(roomId: string, user: { name: string; avatar?: string; email?: string }, topic: string): Promise<RoomMember> {
  const room = await fetchRoom(roomId);
  if (!room) throw new Error('This room is no longer available.');
  const userId = user.email || 'local-user';
  const existingMembers = await fetchRoomMembers(roomId);
  if (!existingMembers.some((member) => member.user_id === userId) && existingMembers.length >= room.max_members) {
    throw new Error('This room has reached its capacity.');
  }
  const member: RoomMember = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `member-${Date.now()}`,
    room_id: roomId,
    user_id: userId,
    user_name: user.name || 'Student',
    user_avatar: user.avatar || (user.name || 'S').split(' ').map((part) => part[0]).join('').slice(0, 2),
    role: 'member', topic: topic || 'General study', camera_on: false, mic_on: false, hand_raised: false,
    joined_at: new Date().toISOString(), study_started_at: new Date().toISOString(),
  };
  if (supabase) {
    try {
      const { error } = await supabase.from('room_members').upsert(member, { onConflict: 'room_id,user_id' });
      if (!error) return member;
      usingSharedStorage = false;
      console.warn('Presence is device-only because the room service is unavailable.', error);
    } catch (error) { console.warn('Presence is device-only because the room service is unavailable.', error); }
  }
  const store = readStore<Record<string, RoomMember[]>>(keys.members, {});
  store[roomId] = [member, ...(store[roomId] || []).filter((item) => item.user_id !== member.user_id)];
  writeStore(keys.members, store, 'vlib_members_updated');
  return member;
}

export async function leaveRoom(roomId: string, userId: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from('room_members').delete().eq('room_id', roomId).eq('user_id', userId);
      if (error) console.warn('Could not sync leaving the room.', error);
    } catch (error) { console.warn('Could not sync leaving the room.', error); }
  }
  const store = readStore<Record<string, RoomMember[]>>(keys.members, {});
  store[roomId] = (store[roomId] || []).filter((member) => member.user_id !== userId);
  writeStore(keys.members, store, 'vlib_members_updated');
}

export async function fetchRoomMessages(roomId: string): Promise<RoomMessage[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('room_messages').select('*').eq('room_id', roomId).order('created_at', { ascending: true });
      if (!error && data) return mergeRows(data as RoomMessage[], readStore<Record<string, RoomMessage[]>>(keys.messages, {})[roomId] || []).sort((a, b) => a.created_at.localeCompare(b.created_at));
      usingSharedStorage = false;
    } catch { usingSharedStorage = false; /* Use local messages while offline. */ }
  }
  return readStore<Record<string, RoomMessage[]>>(keys.messages, {})[roomId] || [];
}

export async function sendRoomMessage(roomId: string, user: { name: string; avatar?: string; email?: string }, text: string): Promise<RoomMessage> {
  const message = text.trim();
  if (!message) throw new Error('Write a message first.');
  const row: RoomMessage = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `msg-${Date.now()}`,
    room_id: roomId, user_id: user.email || 'local-user', user_name: user.name || 'Student',
    user_avatar: user.avatar || (user.name || 'S').slice(0, 2).toUpperCase(), message,
    created_at: new Date().toISOString(),
  };
  if (supabase) {
    try {
      const { data, error } = await supabase.from('room_messages').insert(row).select().single();
      if (!error && data) return data as RoomMessage;
      usingSharedStorage = false;
      console.warn('Message is saved on this device because the room service is unavailable.', error);
    } catch (error) { usingSharedStorage = false; console.warn('Message is saved on this device because the room service is unavailable.', error); }
  }
  const store = readStore<Record<string, RoomMessage[]>>(keys.messages, {});
  store[roomId] = [...(store[roomId] || []), row];
  writeStore(keys.messages, store, 'vlib_messages_updated');
  return row;
}

export function startStudySession(roomId: string, roomName: string, userId: string, topic: string, goal?: string): StudySession {
  const session: StudySession = { id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `session-${Date.now()}`, room_id: roomId, room_name: roomName, user_id: userId, topic, goal, started_at: new Date().toISOString(), duration_seconds: 0 };
  if (typeof window !== 'undefined') localStorage.setItem('placementhub_active_session', JSON.stringify(session));
  return session;
}

export function endStudySession(): StudySession | null {
  if (typeof window === 'undefined') return null;
  const active = readStore<StudySession | null>('placementhub_active_session', null);
  if (!active) return null;
  const endedAt = new Date().toISOString();
  const completed = { ...active, ended_at: endedAt, duration_seconds: Math.max(0, Math.round((Date.now() - Date.parse(active.started_at)) / 1000)) };
  writeStore(keys.sessions, [completed, ...readStore<StudySession[]>(keys.sessions, [])], 'vlib_sessions_updated');
  localStorage.removeItem('placementhub_active_session');
  if (supabase) {
    const { id: _localId, ...persisted } = completed;
    void (async () => {
      try {
        const { error } = await supabase.from('study_sessions').insert({ ...persisted, room_id: completed.room_id.startsWith('room-') || completed.room_id === 'personal-focus' ? null : completed.room_id });
        if (error) console.warn('Study session stayed on this device because sync failed.', error);
      } catch (error) { console.warn('Study session stayed on this device because sync failed.', error); }
    })();
  }
  return completed;
}

export function fetchStudyHistory(): StudySession[] {
  return readStore<StudySession[]>(keys.sessions, []);
}
