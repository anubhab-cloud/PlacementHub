/**
 * lib/library/room-engine.ts — Core Generic Room Engine & Data Store
 */

import { supabase } from '../supabase';
import { Room, RoomCapabilities, RoomMember, RoomMessage, RoomType, StudySession } from './types';

// ─────────────────────────────────────────────────────────────────
// DEFAULT CAPABILITIES BY ROOM TYPE
// ─────────────────────────────────────────────────────────────────
export function getDefaultCapabilities(type: RoomType): RoomCapabilities {
  switch (type) {
    case 'community':
      return {
        camera: true,
        voice: false, // Disabled by default in public hall
        chat: true,
        screen_share: false,
        coding: false,
        whiteboard: false,
        ask_to_talk: true,
      };
    case 'private':
      return {
        camera: true,
        voice: true,
        chat: true,
        screen_share: true,
        coding: true,
        whiteboard: true,
        ask_to_talk: true,
      };
    case 'coding':
      return {
        camera: true,
        voice: true,
        chat: true,
        screen_share: true,
        coding: true,
        whiteboard: false,
        ask_to_talk: false,
      };
    case 'interview':
      return {
        camera: true,
        voice: true,
        chat: true,
        screen_share: true,
        coding: true,
        whiteboard: true,
        ask_to_talk: true,
      };
  }
}

// ─────────────────────────────────────────────────────────────────
// INITIAL SEED ROOMS FOR IMMEDIATE READY-TO-USE PREVIEW
// ─────────────────────────────────────────────────────────────────
export const SEED_ROOMS: Room[] = [
  {
    id: 'community-hall-1',
    name: 'Community Study Hall',
    description: 'Study together without the noise. Public silent campus for all students.',
    type: 'community',
    owner_id: 'system',
    owner_name: 'PlacementHub',
    privacy: 'public',
    max_members: 500,
    capabilities: getDefaultCapabilities('community'),
    topic_distribution: { 'DSA': 43, 'DBMS': 27, 'Coding': 31, 'Aptitude': 19, 'System Design': 14 },
    active_students_count: 246,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dsa-grind-evening',
    name: 'DSA Grind — Evening',
    description: 'Targeted DP, Trees, and Graph problem solving group.',
    type: 'private',
    owner_id: 'user_riya',
    owner_name: 'Riya Sharma',
    privacy: 'public',
    max_members: 12,
    capabilities: getDefaultCapabilities('private'),
    topic_distribution: { 'DSA': 8 },
    active_students_count: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sys-design-lounge',
    name: 'System Design & LLD Lounge',
    description: 'Designing scalable backend systems, Redis caches, and rate limiters.',
    type: 'coding',
    owner_id: 'user_karan',
    owner_name: 'Karan Malhotra',
    privacy: 'public',
    max_members: 15,
    capabilities: getDefaultCapabilities('coding'),
    topic_distribution: { 'System Design': 5, 'DBMS': 3 },
    active_students_count: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-interview-lab',
    name: 'Mock Interview & Peer Review Lab',
    description: 'Live 1-on-1 peer technical interviews and feedback sessions.',
    type: 'interview',
    owner_id: 'user_anubhab',
    owner_name: 'Anubhab C.',
    privacy: 'public',
    max_members: 6,
    capabilities: getDefaultCapabilities('interview'),
    topic_distribution: { 'Interviews': 4 },
    active_students_count: 4,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_MEMBERS: Record<string, RoomMember[]> = {
  'community-hall-1': [
    { id: 'm1', room_id: 'community-hall-1', user_id: 'u1', user_name: 'Anubhab Chakraborty', user_avatar: 'AC', role: 'member', topic: 'DSA — Dynamic Programming', camera_on: true, mic_on: false, hand_raised: false, joined_at: new Date().toISOString(), study_started_at: new Date(Date.now() - 42 * 60 * 1000).toISOString() },
    { id: 'm2', room_id: 'community-hall-1', user_id: 'u2', user_name: 'Riya Sharma', user_avatar: 'RS', role: 'member', topic: 'DBMS — Indexing & Normalization', camera_on: true, mic_on: false, hand_raised: false, joined_at: new Date().toISOString(), study_started_at: new Date(Date.now() - 28 * 60 * 1000).toISOString() },
    { id: 'm3', room_id: 'community-hall-1', user_id: 'u3', user_name: 'Karan Malhotra', user_avatar: 'KM', role: 'member', topic: 'Coding Workspace — LeetCode 150', camera_on: false, mic_on: false, hand_raised: false, joined_at: new Date().toISOString(), study_started_at: new Date(Date.now() - 65 * 60 * 1000).toISOString() },
    { id: 'm4', room_id: 'community-hall-1', user_id: 'u4', user_name: 'Priya Desai', user_avatar: 'PD', role: 'member', topic: 'Aptitude & Logical Speed Test', camera_on: true, mic_on: false, hand_raised: false, joined_at: new Date().toISOString(), study_started_at: new Date(Date.now() - 19 * 60 * 1000).toISOString() },
    { id: 'm5', room_id: 'community-hall-1', user_id: 'u5', user_name: 'Arjun Verma', user_avatar: 'AV', role: 'member', topic: 'OS — Process Synchronization', camera_on: false, mic_on: false, hand_raised: false, joined_at: new Date().toISOString(), study_started_at: new Date(Date.now() - 55 * 60 * 1000).toISOString() },
    { id: 'm6', room_id: 'community-hall-1', user_id: 'u6', user_name: 'Sneha Patel', user_avatar: 'SP', role: 'member', topic: 'SQL — Window Functions', camera_on: true, mic_on: false, hand_raised: false, joined_at: new Date().toISOString(), study_started_at: new Date(Date.now() - 34 * 60 * 1000).toISOString() },
  ],
};

export const INITIAL_MESSAGES: Record<string, RoomMessage[]> = {
  'community-hall-1': [
    { id: 'msg1', room_id: 'community-hall-1', user_id: 'u1', user_name: 'Anubhab Chakraborty', user_avatar: 'AC', message: 'Anyone solving 0/1 Knapsack DP today?', created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: 'msg2', room_id: 'community-hall-1', user_id: 'u2', user_name: 'Riya Sharma', user_avatar: 'RS', message: 'Yes! Working on memoization vs bottom-up tabulation.', created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString() },
    { id: 'msg3', room_id: 'community-hall-1', user_id: 'u3', user_name: 'Karan Malhotra', user_avatar: 'KM', message: 'Doing DBMS transaction isolation levels revision right now.', created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
    { id: 'msg4', room_id: 'community-hall-1', user_id: 'u4', user_name: 'Priya Desai', user_avatar: 'PD', message: 'Just finished 45 min Aptitude speed test. Feeling ready!', created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString() },
  ],
};

// Local storage keys
const STORAGE_KEY_ROOMS = 'placementhub_vlib_rooms';
const STORAGE_KEY_MEMBERS = 'placementhub_vlib_members';
const STORAGE_KEY_MSGS = 'placementhub_vlib_messages';
const STORAGE_KEY_SESSIONS = 'placementhub_vlib_sessions';

// ─────────────────────────────────────────────────────────────────
// ENGINE METHODS (HYBRID STORAGE: SUPABASE + LOCALSTORAGE)
// ─────────────────────────────────────────────────────────────────

export async function fetchRooms(): Promise<Room[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('rooms').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Room[];
    } catch (e) {
      console.warn('Supabase fetch rooms failed, falling back to local engine store');
    }
  }

  // Local fallback
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY_ROOMS);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(SEED_ROOMS));
  }
  return SEED_ROOMS;
}

export async function fetchRoom(roomId: string): Promise<Room | null> {
  const rooms = await fetchRooms();
  return rooms.find((r) => r.id === roomId) || null;
}

export async function createRoom(roomData: Partial<Room>): Promise<Room> {
  const type = roomData.type || 'private';
  const newRoom: Room = {
    id: `room-${Date.now()}`,
    name: roomData.name || 'Custom Study Room',
    description: roomData.description || 'Focused peer study group',
    type,
    owner_id: roomData.owner_id || 'anubhab_user',
    owner_name: roomData.owner_name || 'Anubhab C.',
    privacy: roomData.privacy || 'public',
    max_members: roomData.max_members || 10,
    capabilities: roomData.capabilities || getDefaultCapabilities(type),
    topic_distribution: { [roomData.description?.slice(0, 10) || 'Study']: 1 },
    active_students_count: 1,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('rooms').insert(newRoom);
    } catch (e) {
      console.warn('Supabase create room failed, fallback to local');
    }
  }

  if (typeof window !== 'undefined') {
    const current = await fetchRooms();
    const updated = [newRoom, ...current];
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(updated));
    window.dispatchEvent(new Event('vlib_rooms_updated'));
  }

  return newRoom;
}

export async function fetchRoomMembers(roomId: string): Promise<RoomMember[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('room_members').select('*').eq('room_id', roomId);
      if (!error && data && data.length > 0) return data as RoomMember[];
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (raw) {
      try {
        const store = JSON.parse(raw);
        if (store[roomId]) return store[roomId];
      } catch (e) {}
    }
  }

  return INITIAL_MEMBERS[roomId] || [];
}

export async function joinRoom(roomId: string, user: { name: string; avatar?: string; email?: string }, topic: string): Promise<RoomMember> {
  const member: RoomMember = {
    id: `m-${Date.now()}`,
    room_id: roomId,
    user_id: user.email || 'anubhab@nexusprep.io',
    user_name: user.name || 'Anubhab C.',
    user_avatar: user.avatar || 'AC',
    role: 'member',
    topic: topic || 'General Placement Prep',
    camera_on: true,
    mic_on: false,
    hand_raised: false,
    joined_at: new Date().toISOString(),
    study_started_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('room_members').upsert(member);
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    const members = await fetchRoomMembers(roomId);
    const updatedMembers = [member, ...members.filter((m) => m.user_id !== member.user_id)];
    
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    const store = raw ? JSON.parse(raw) : { ...INITIAL_MEMBERS };
    store[roomId] = updatedMembers;
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(store));
    window.dispatchEvent(new Event('vlib_members_updated'));
  }

  return member;
}

export async function fetchRoomMessages(roomId: string): Promise<RoomMessage[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('room_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) return data as RoomMessage[];
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY_MSGS);
    if (raw) {
      try {
        const store = JSON.parse(raw);
        if (store[roomId]) return store[roomId];
      } catch (e) {}
    }
  }

  return INITIAL_MESSAGES[roomId] || [];
}

export async function sendRoomMessage(roomId: string, user: { name: string; avatar?: string; email?: string }, text: string): Promise<RoomMessage> {
  const newMsg: RoomMessage = {
    id: `msg-${Date.now()}`,
    room_id: roomId,
    user_id: user.email || 'anubhab@nexusprep.io',
    user_name: user.name || 'Anubhab C.',
    user_avatar: user.avatar || 'AC',
    message: text.trim(),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('room_messages').insert(newMsg);
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    const msgs = await fetchRoomMessages(roomId);
    const updated = [...msgs, newMsg];
    const raw = localStorage.getItem(STORAGE_KEY_MSGS);
    const store = raw ? JSON.parse(raw) : { ...INITIAL_MESSAGES };
    store[roomId] = updated;
    localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(store));
    window.dispatchEvent(new Event('vlib_messages_updated'));
  }

  return newMsg;
}

// ─────────────────────────────────────────────────────────────────
// STUDY SESSION TRACKER
// ─────────────────────────────────────────────────────────────────

export function startStudySession(roomId: string, roomName: string, userId: string, topic: string, goal?: string): StudySession {
  const session: StudySession = {
    id: `session-${Date.now()}`,
    room_id: roomId,
    room_name: roomName,
    user_id: userId,
    topic: topic || 'General Study',
    goal: goal || 'Productive study sprint',
    started_at: new Date().toISOString(),
    duration_seconds: 0,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('placementhub_active_session', JSON.stringify(session));
  }
  return session;
}

export function endStudySession(): StudySession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('placementhub_active_session');
  if (!raw) return null;

  try {
    const active: StudySession = JSON.parse(raw);
    const endedAt = new Date().toISOString();
    const duration = Math.round((new Date(endedAt).getTime() - new Date(active.started_at).getTime()) / 1000);

    const completed: StudySession = {
      ...active,
      ended_at: endedAt,
      duration_seconds: duration,
    };

    // Save to history
    const historyRaw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    const history: StudySession[] = historyRaw ? JSON.parse(historyRaw) : [];
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify([completed, ...history]));
    localStorage.removeItem('placementhub_active_session');

    if (supabase) {
      supabase.from('study_sessions').insert(completed).then(() => {});
    }

    return completed;
  } catch (e) {
    return null;
  }
}

export function fetchStudyHistory(): StudySession[] {
  if (typeof window === 'undefined') return [];
  const historyRaw = localStorage.getItem(STORAGE_KEY_SESSIONS);
  return historyRaw ? JSON.parse(historyRaw) : [
    {
      id: 's1',
      room_id: 'community-hall-1',
      room_name: 'Community Study Hall',
      user_id: 'anubhab@nexusprep.io',
      topic: 'Data Structures & Algorithms',
      goal: 'Solve 3 Dynamic Programming problems',
      started_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      ended_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      duration_seconds: 75 * 60,
    },
    {
      id: 's2',
      room_id: 'dsa-grind-evening',
      room_name: 'DSA Grind — Evening',
      user_id: 'anubhab@nexusprep.io',
      topic: 'DBMS Normalization',
      goal: 'Review BCNF & 3NF functional dependencies',
      started_at: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
      ended_at: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
      duration_seconds: 60 * 60,
    },
  ];
}
