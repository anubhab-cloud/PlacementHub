/**
 * lib/library/realtime.ts — Supabase Realtime & Presence Manager
 */

import { supabase } from '../supabase';
import { RoomMessage, RoomMember } from './types';

export interface PresenceState {
  user_id: string;
  user_name: string;
  user_avatar: string;
  topic: string;
  camera_on: boolean;
  mic_on: boolean;
  hand_raised: boolean;
  online_at: string;
}

export type ChatCallback = (msg: RoomMessage) => void;
export type PresenceCallback = (members: PresenceState[]) => void;
export type TypingCallback = (userName: string) => void;

export function subscribeToRooms(onChange: () => void) {
  if (!supabase) return () => {};
  const channel = supabase.channel('vlib_rooms_catalog');
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, onChange);
  channel.subscribe();
  return () => { if (supabase) void supabase.removeChannel(channel); };
}

/**
 * Subscribe to Supabase Realtime Channel for a given Room ID
 */
export function subscribeToRoomRealtime(
  roomId: string,
  currentUser: { email?: string; name: string; avatar?: string },
  activeTopic: string,
  isCameraOn: boolean,
  isMicOn: boolean,
  onNewMessage: ChatCallback,
  onPresenceUpdate: PresenceCallback,
  onTypingNotice: TypingCallback,
  onConnectionChange: (connected: boolean) => void = () => {}
) {
  if (!supabase) {
    onConnectionChange(false);
    return () => {};
  }

  const channelName = `vlib_room_${roomId}`;
  const channel = supabase.channel(channelName, {
    config: {
      presence: {
        key: currentUser.email || `anon-${Date.now()}`,
      },
    },
  });

  // 1. Listen for new chat messages inserted into room_messages table
  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'room_messages',
      filter: `room_id=eq.${roomId}`,
    },
    (payload) => {
      const newMsg = payload.new as RoomMessage;
      onNewMessage(newMsg);
    }
  );

  // 2. Listen for transient Broadcast events (typing indicators)
  channel.on('broadcast', { event: 'typing' }, (payload) => {
    if (payload.payload?.userName && payload.payload.userName !== currentUser.name) {
      onTypingNotice(payload.payload.userName);
    }
  });

  // 3. Track Realtime Presence (online users & camera/mic states)
  channel.on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState<PresenceState>();
    const activeMembers: PresenceState[] = [];
    Object.values(state).forEach((presences) => {
      presences.forEach((p) => activeMembers.push(p));
    });
    onPresenceUpdate(activeMembers);
  });

  // Subscribe and track current user presence
  channel.subscribe(async (status) => {
    onConnectionChange(status === 'SUBSCRIBED');
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: currentUser.email || 'anon_user',
        user_name: currentUser.name,
        user_avatar: currentUser.avatar || 'AC',
        topic: activeTopic || 'General Study',
        camera_on: isCameraOn,
        mic_on: isMicOn,
        hand_raised: false,
        online_at: new Date().toISOString(),
      });
    }
  });

  // Return unsubscribe function
  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}

/**
 * Broadcast typing status to room members
 */
export function sendTypingBroadcast(roomId: string, userName: string) {
  if (!supabase) return;
  const channel = supabase.channel(`vlib_room_${roomId}`);
  channel.send({
    type: 'broadcast',
    event: 'typing',
    payload: { userName },
  });
}
