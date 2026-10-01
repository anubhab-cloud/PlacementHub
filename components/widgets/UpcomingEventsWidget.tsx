'use client';
import { useState, useEffect } from 'react';

type EventItem = {
  id?: string;
  name: string;
  date: string;
  type: string;
};

const initialEvents: EventItem[] = [
  { id: '1', name: 'Amazon OA',              date: 'Oct 26', type: 'OA' },
  { id: '2', name: 'Microsoft interview',    date: 'Oct 29', type: 'Interview' },
  { id: '3', name: 'TCS pre-placement talk', date: 'Nov 2',  type: 'Talk' },
  { id: '4', name: 'Google STEP deadline',   date: 'Nov 10', type: 'Deadline' },
  { id: '5', name: 'Flipkart FSMK round',    date: 'Nov 15', type: 'OA' },
];

export default function UpcomingEventsWidget() {
  const [eventList, setEventList] = useState<EventItem[]>(initialEvents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState('OA');

  useEffect(() => {
    const saved = localStorage.getItem('nexusprep_events');
    if (saved) {
      try {
        setEventList(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveEvents = (events: EventItem[]) => {
    setEventList(events);
    localStorage.setItem('nexusprep_events', JSON.stringify(events));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDate.trim()) return;
    const item: EventItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      date: newDate.trim(),
      type: newType,
    };
    saveEvents([item, ...eventList]);
    setNewName('');
    setNewDate('');
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id?: string, idx?: number) => {
    const filtered = eventList.filter((ev, i) => (ev.id ? ev.id !== id : i !== idx));
    saveEvents(filtered);
  };

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="widget-icon-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>
        <span className="widget-title">Upcoming events</span>
        <button className="widget-add-btn" onClick={() => setShowAddModal(true)}>Add</button>
      </div>

      <div className="events-list-container">
        {eventList.length === 0 ? (
          <div style={{ fontSize: '12px', color: '#6B7280', padding: '10px 0', textAlign: 'center' }}>No upcoming events added yet.</div>
        ) : (
          eventList.map((ev, idx) => (
            <div className="event-row-item" key={ev.id || idx} style={{ position: 'relative' }}>
              <span className="event-item-name">{ev.name}</span>
              <span className="event-item-type-pill">{ev.type}</span>
              <span className="event-item-date">{ev.date}</span>
              <button
                onClick={() => handleDeleteEvent(ev.id, idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: '0 4px',
                  marginLeft: '4px',
                  opacity: 0.6,
                }}
                title="Remove event"
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
          <form onSubmit={handleAddEvent} className="dashboard-widget-card" style={{ width: '320px', padding: '20px', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#fff' }}>Add New Event</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Event Name</label>
              <input
                type="text"
                placeholder="e.g. Google Interview"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Date</label>
                <input
                  type="text"
                  placeholder="e.g. Oct 28"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                >
                  <option value="OA">OA</option>
                  <option value="Interview">Interview</option>
                  <option value="Talk">Talk</option>
                  <option value="Deadline">Deadline</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" className="warmup-btn-dark" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="warmup-btn-purple">Save Event</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

