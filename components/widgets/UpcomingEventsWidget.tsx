'use client';
import { useState } from 'react';

const initialEvents = [
  { name: 'Amazon OA',             date: 'Oct 26', dot: '#ffb347', type: 'OA',        typePill: 'pill-amber' },
  { name: 'Microsoft Interview',   date: 'Oct 29', dot: '#00d4ff', type: 'Interview',  typePill: 'pill-cyan' },
  { name: 'TCS Pre-placement talk',date: 'Nov 2',  dot: '#00e5a0', type: 'Talk',       typePill: 'pill-green' },
  { name: 'Google STEP Deadline',  date: 'Nov 10', dot: '#ff4d6d', type: 'Deadline',   typePill: 'pill-red' },
  { name: 'Flipkart FSMK Round',   date: 'Nov 15', dot: '#9d5bf5', type: 'OA',        typePill: 'pill-violet' },
];

export default function UpcomingEventsWidget() {
  const [eventList, setEventList] = useState(initialEvents);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedType, setSelectedType] = useState('OA');

  const types = [
    { name: 'OA', dot: '#ffb347', typePill: 'pill-amber' },
    { name: 'Interview', dot: '#00d4ff', typePill: 'pill-cyan' },
    { name: 'Talk', dot: '#00e5a0', typePill: 'pill-green' },
    { name: 'Deadline', dot: '#ff4d6d', typePill: 'pill-red' },
    { name: 'Other', dot: '#9d5bf5', typePill: 'pill-violet' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date.trim()) return;
    const t = types.find(x => x.name === selectedType) || types[0];
    const newEvent = {
      name: name.trim(),
      date: date.trim(),
      dot: t.dot,
      type: selectedType,
      typePill: t.typePill
    };
    setEventList([newEvent, ...eventList]);
    setName('');
    setDate('');
    setShowAddForm(false);
  };

  return (
    <div className="card events-widget">
      <div className="card-header">
        <span className="card-label"><span className="lbl-icon">📅</span> Upcoming Events</span>
        <button
          className="btn btn-ghost btn-xs"
          id="btn-add-event"
          style={{ borderRadius: '100px' }}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Close' : '+ Add'}
        </button>
      </div>
      <div className="card-body">
        {showAddForm && (
          <form onSubmit={handleSubmit} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'slideDown 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-2)' }}>Add New Event</div>
            <input
              type="text"
              placeholder="Event Name (e.g. Amazon Interview)"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                color: 'var(--text-1)',
                outline: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Date (e.g. Oct 30)"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                color: 'var(--text-1)',
                outline: 'none',
              }}
            />
            
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
              {types.map(t => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setSelectedType(t.name)}
                  style={{
                    fontSize: '9px',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    border: selectedType === t.name ? `1px solid ${t.dot}` : '1px solid rgba(255,255,255,0.1)',
                    background: selectedType === t.name ? `${t.dot}20` : 'transparent',
                    color: selectedType === t.name ? t.dot : 'var(--text-2)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-ghost btn-xs"
                style={{ borderRadius: '6px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-violet btn-xs"
                style={{ borderRadius: '6px', background: 'var(--grad-violet)', color: 'white' }}
              >
                Add Event
              </button>
            </div>
          </form>
        )}

        {eventList.map((ev, idx) => (
          <div 
            className="event-row" 
            key={`${ev.name}-${idx}`}
            style={{
              animation: 'slideDown 0.3s ease-out'
            }}
          >
            <div
              className="event-dot"
              style={{ background: ev.dot, boxShadow: `0 0 8px ${ev.dot}` }}
            />
            <span className="event-name">{ev.name}</span>
            <span className={`pill ${ev.typePill}`} style={{ fontSize: '9px', padding: '2px 8px' }}>
              {ev.type}
            </span>
            <span className="event-date">{ev.date}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
