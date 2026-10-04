/**
 * lib/library/types.ts — TypeScript Interfaces for Virtual Library Engine
 */

export type RoomType = 'community' | 'private' | 'coding' | 'interview';

export interface RoomCapabilities {
  camera: boolean;
  voice: boolean;
  chat: boolean;
  screen_share: boolean;
  coding: boolean;
  whiteboard: boolean;
  ask_to_talk: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  type: RoomType;
  owner_id: string;
  owner_name: string;
  privacy: 'public' | 'private';
  max_members: number;
  capabilities: RoomCapabilities;
  topic_distribution: Record<string, number>;
  active_students_count: number;
  created_at: string;
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  role: 'owner' | 'moderator' | 'member';
  topic: string;
  camera_on: boolean;
  mic_on: boolean;
  hand_raised: boolean;
  joined_at: string;
  study_started_at: string;
}

export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  message: string;
  created_at: string;
  is_me?: boolean;
}

export interface StudySession {
  id: string;
  room_id: string;
  room_name: string;
  user_id: string;
  topic: string;
  goal?: string;
  started_at: string;
  ended_at?: string;
  duration_seconds: number;
}

export interface StudyGoal {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  target_minutes: number;
}
