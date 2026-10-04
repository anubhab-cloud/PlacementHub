'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoomMessage, RoomMember, Room } from '@/lib/library/types';
import {
  fetchRooms,
  fetchRoomMessages,
  fetchRoomMembers,
  sendRoomMessage,
  joinRoom,
  createRoom,
  startStudySession,
  endStudySession,
  INITIAL_MESSAGES,
} from '@/lib/library/room-engine';
import { subscribeToRoomRealtime } from '@/lib/library/realtime';

import VirtualLibHero from '@/components/library/VirtualLibHero';
import VirtualLibSidebarPanel from '@/components/library/VirtualLibSidebarPanel';
import VirtualLibGrid from '@/components/library/VirtualLibGrid';
import FocusTimerWidget from '@/components/library/FocusTimerWidget';
import TodaysGoalWidget from '@/components/library/TodaysGoalWidget';
import QuickActionsWidget from '@/components/library/QuickActionsWidget';
import RecommendedRoomsWidget from '@/components/library/RecommendedRoomsWidget';
import HallChatPanel from '@/components/library/HallChatPanel';
import CreateRoomModal from '@/components/library/CreateRoomModal';

const COMMUNITY_HALL_ID = 'community-hall-1';

export default function VirtualLibPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('community');
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ── Load initial data ──────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [msgs, mems, rms] = await Promise.all([
          fetchRoomMessages(COMMUNITY_HALL_ID),
          fetchRoomMembers(COMMUNITY_HALL_ID),
          fetchRooms(),
        ]);
        setMessages(msgs);
        setMembers(mems);
        setRooms(rms);
      } catch (e) {
        console.error('Virtual Lib load error:', e);
        // Graceful fallback – show seed data
        setMessages(INITIAL_MESSAGES[COMMUNITY_HALL_ID] || []);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Auto-join community hall when user is available ───────────
  useEffect(() => {
    if (!user || isJoined) return;

    async function autoJoin() {
      try {
        const member = await joinRoom(
          COMMUNITY_HALL_ID,
          { name: user!.name || 'Anubhab', avatar: user!.avatar || 'AC', email: user!.email },
          'General Placement Prep'
        );
        setIsJoined(true);
        setMembers((prev) => {
          const filtered = prev.filter((m) => m.user_id !== member.user_id);
          return [member, ...filtered];
        });
        startStudySession(COMMUNITY_HALL_ID, 'Community Study Hall', user!.email || '', 'General Study');
      } catch (e) {
        console.warn('Auto-join failed:', e);
      }
    }
    autoJoin();
  }, [user, isJoined]);

  // ── Supabase Realtime subscription ───────────────────────────
  useEffect(() => {
    if (!user) return;

    const unsub = subscribeToRoomRealtime(
      COMMUNITY_HALL_ID,
      { email: user.email, name: user.name || 'Anubhab', avatar: user.avatar || 'AC' },
      'General Study',
      false,
      false,
      (newMsg: RoomMessage) => {
        setMessages((prev) => {
          if (prev.find((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      },
      (presenceMembers) => {
        // Map presence state to RoomMember shape
        const presenceMapped: RoomMember[] = presenceMembers.map((p) => ({
          id: p.user_id,
          room_id: COMMUNITY_HALL_ID,
          user_id: p.user_id,
          user_name: p.user_name,
          user_avatar: p.user_avatar,
          role: 'member' as const,
          topic: p.topic,
          camera_on: p.camera_on,
          mic_on: p.mic_on,
          hand_raised: p.hand_raised,
          joined_at: p.online_at,
          study_started_at: p.online_at,
        }));
        if (presenceMapped.length > 0) {
          setMembers(presenceMapped);
        }
      },
      (_typingUser: string) => {
        // Typing indicator handled inside HallChatPanel
      }
    );

    unsubscribeRef.current = unsub;
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [user]);

  // ── Listen for local engine events (localStorage updates) ────
  useEffect(() => {
    const handleRoomsUpdate = async () => {
      const rms = await fetchRooms();
      setRooms(rms);
    };
    const handleMembersUpdate = async () => {
      const mems = await fetchRoomMembers(COMMUNITY_HALL_ID);
      setMembers(mems);
    };
    const handleMessagesUpdate = async () => {
      const msgs = await fetchRoomMessages(COMMUNITY_HALL_ID);
      setMessages(msgs);
    };

    window.addEventListener('vlib_rooms_updated', handleRoomsUpdate);
    window.addEventListener('vlib_members_updated', handleMembersUpdate);
    window.addEventListener('vlib_messages_updated', handleMessagesUpdate);
    return () => {
      window.removeEventListener('vlib_rooms_updated', handleRoomsUpdate);
      window.removeEventListener('vlib_members_updated', handleMembersUpdate);
      window.removeEventListener('vlib_messages_updated', handleMessagesUpdate);
    };
  }, []);

  // ── Send message ─────────────────────────────────────────────
  const handleSendMessage = useCallback(async (text: string) => {
    const newMsg = await sendRoomMessage(
      COMMUNITY_HALL_ID,
      { name: user?.name || 'Anubhab', avatar: user?.avatar || 'AC', email: user?.email },
      text
    );
    setMessages((prev) => {
      if (prev.find((m) => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
  }, [user]);

  // ── Leave hall ────────────────────────────────────────────────
  const handleLeaveHall = useCallback(() => {
    setIsJoined(false);
    endStudySession();
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    // Remove self from member list
    if (user?.email) {
      setMembers((prev) => prev.filter((m) => m.user_id !== (user.email || '')));
    }
  }, [user]);

  // ── Create Room ───────────────────────────────────────────────
  const handleCreateRoom = useCallback(async (data: any) => {
    try {
      const newRoom = await createRoom({
        ...data,
        owner_id: user?.email || 'anon',
        owner_name: user?.name || 'Anonymous',
      });
      setRooms((prev) => [newRoom, ...prev]);
      setIsCreateModalOpen(false);
    } catch (e) {
      console.error('Failed to create room:', e);
    }
  }, [user]);

  // ── Computed stats from real data ─────────────────────────────
  const totalStudentCount = rooms.reduce((sum, r) => sum + (r.active_students_count || 0), 0);
  const activeRoomsCount = rooms.length;

  return (
    <div className="dashboard-container" style={{ padding: '20px 24px', minHeight: '100vh', background: '#0b0c15' }}>
      {/* Top Hero Banner — real stats */}
      <VirtualLibHero
        studentsCount={totalStudentCount || members.length}
        activeRoomsCount={activeRoomsCount}
        members={members}
      />

      {/* Top Category Sub-Navigation Pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'community', label: 'Community hall' },
          { id: 'private', label: 'Private rooms' },
          { id: 'live-coding', label: 'Live coding' },
          { id: 'challenges', label: 'Ideas and challenges' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? '#5e43ff' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#ffffff' : '#9a9cb8',
                fontSize: '13px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                boxShadow: isActive ? '0 4px 14px rgba(94, 67, 255, 0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main 3-Column Studio Layout */}
      <div style={{ display: 'flex', gap: '20px', minHeight: '680px', alignItems: 'stretch' }}>
        {/* Left Column Navigation & "Live now" breakdown */}
        <VirtualLibSidebarPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          members={members}
        />

        {/* Center Main Study Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          {/* Main 8-Participant Video/Avatar Grid */}
          <VirtualLibGrid
            members={members}
            currentUserId={user?.email || ''}
            isJoined={isJoined}
            onLeaveHall={handleLeaveHall}
            onJoinHall={async () => {
              if (!user) return;
              const member = await joinRoom(
                COMMUNITY_HALL_ID,
                { name: user.name || 'Anubhab', avatar: user.avatar || 'AC', email: user.email },
                'General Placement Prep'
              );
              setIsJoined(true);
              setMembers((prev) => {
                const filtered = prev.filter((m) => m.user_id !== member.user_id);
                return [member, ...filtered];
              });
              startStudySession(COMMUNITY_HALL_ID, 'Community Study Hall', user.email || '', 'General Study');
            }}
          />

          {/* Bottom 3-Column Widget Row under Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px', marginTop: '4px' }}>
            {/* Widget 1: Focus Session Pomodoro Ring */}
            <FocusTimerWidget />

            {/* Widget 2: Today's Goal Checklist */}
            <TodaysGoalWidget userId={user?.email || 'anon'} />

            {/* Widget 3: Quick Actions Grid */}
            <QuickActionsWidget onOpenCreateRoom={() => setIsCreateModalOpen(true)} />
          </div>

          {/* Recommended Rooms Bar — real rooms */}
          <RecommendedRoomsWidget rooms={rooms} />
        </div>

        {/* Right Side Panel: Hall Chat & Active Challenges */}
        <HallChatPanel
          messages={messages}
          members={members}
          currentUserId={user?.email || ''}
          currentUserName={user?.name || 'Anubhab'}
          currentUserAvatar={user?.avatar || 'AC'}
          onSendMessage={handleSendMessage}
          roomId={COMMUNITY_HALL_ID}
        />
      </div>

      {/* Create Room Modal — calls real createRoom() */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}
