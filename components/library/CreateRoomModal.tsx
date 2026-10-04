'use client';
import React, { useState } from 'react';
import { RoomType, RoomCapabilities } from '@/lib/library/types';
import { getDefaultCapabilities } from '@/lib/library/room-engine';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (data: {
    name: string;
    description: string;
    type: RoomType;
    privacy: 'public' | 'private';
    max_members: number;
    capabilities: RoomCapabilities;
  }) => void;
}

export default function CreateRoomModal({
  isOpen,
  onClose,
  onCreateRoom,
}: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RoomType>('private');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [maxMembers, setMaxMembers] = useState(12);
  const [capabilities, setCapabilities] = useState<RoomCapabilities>(getDefaultCapabilities('private'));

  if (!isOpen) return null;

  const handleTypeChange = (newType: RoomType) => {
    setType(newType);
    setCapabilities(getDefaultCapabilities(newType));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateRoom({
      name: name.trim(),
      description: description.trim() || 'Focused peer study group',
      type,
      privacy,
      max_members: maxMembers,
      capabilities,
    });

    // Reset & Close
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-box" style={{ width: '500px', background: 'rgba(18, 19, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)' }}>
            ➕ Create Virtual Study Room
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '20px', cursor: 'pointer' }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Room Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>
              Room Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DSA Grind — Evening Session"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-1)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>
              Study Topic & Description
            </label>
            <input
              type="text"
              placeholder="e.g. Solving DP & Graph problems together"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-1)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Room Type */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>
              Room Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'private', label: '📖 Study' },
                { id: 'coding', label: '💻 Coding' },
                { id: 'interview', label: '🎤 Interview' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTypeChange(item.id as RoomType)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: type === item.id ? 'rgba(99, 91, 255, 0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${type === item.id ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
                    color: type === item.id ? 'var(--accent)' : 'var(--text-2)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Members */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-2)', marginBottom: '6px' }}>
              <span>Max Capacity</span>
              <strong>{maxMembers} Students</strong>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-violet" style={{ padding: '8px 20px', fontSize: '13px' }}>
              Create Room →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
