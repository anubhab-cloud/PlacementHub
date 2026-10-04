'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoomMessage } from '@/lib/library/types';
import { fetchRoomMessages, sendRoomMessage } from '@/lib/library/room-engine';

import VirtualLibHero from '@/components/library/VirtualLibHero';
import VirtualLibSidebarPanel from '@/components/library/VirtualLibSidebarPanel';
import VirtualLibGrid from '@/components/library/VirtualLibGrid';
import FocusTimerWidget from '@/components/library/FocusTimerWidget';
import TodaysGoalWidget from '@/components/library/TodaysGoalWidget';
import QuickActionsWidget from '@/components/library/QuickActionsWidget';
import RecommendedRoomsWidget from '@/components/library/RecommendedRoomsWidget';
import HallChatPanel from '@/components/library/HallChatPanel';
import CreateRoomModal from '@/components/library/CreateRoomModal';

export default function VirtualLibPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('community');
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [isJoined, setIsJoined] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const msgs = await fetchRoomMessages('community-hall-1');
      setMessages(msgs);
    }
    loadData();
  }, []);

  const handleSendMessage = async (text: string) => {
    const newMsg = await sendRoomMessage(
      'community-hall-1',
      { name: user?.name || 'Anubhab', avatar: user?.avatar || 'AC', email: user?.email },
      text
    );
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleCreateRoom = (data: any) => {
    alert(`Room "${data.name}" created successfully!`);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px 24px', minHeight: '100vh', background: '#0b0c15' }}>
      {/* Top Hero Banner */}
      <VirtualLibHero
        studentsCount={246}
        activeRoomsCount={7}
        totalHoursToday="1.8K hrs"
        weeklySessionsCount="12K"
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
                transition: 'all 0.15s ease'
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
          onlineCount={246}
        />

        {/* Center Main Study Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          {/* Main 8-Participant Video/Avatar Grid */}
          <VirtualLibGrid
            members={[]}
            currentUserId={user?.email || 'anubhab@nexusprep.io'}
            isJoined={isJoined}
            onLeaveHall={() => setIsJoined(false)}
          />

          {/* Bottom 3-Column Widget Row under Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px', marginTop: '4px' }}>
            {/* Widget 1: Focus Session Pomodoro Ring */}
            <FocusTimerWidget />

            {/* Widget 2: Today's Goal Checklist */}
            <TodaysGoalWidget />

            {/* Widget 3: Quick Actions Grid */}
            <QuickActionsWidget onOpenCreateRoom={() => setIsCreateModalOpen(true)} />
          </div>

          {/* Recommended Rooms Bar */}
          <RecommendedRoomsWidget />
        </div>

        {/* Right Side Panel: Hall Chat & Active Challenges */}
        <HallChatPanel
          messages={messages}
          onlineCount={246}
          currentUserId={user?.email || 'anubhab@nexusprep.io'}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}
