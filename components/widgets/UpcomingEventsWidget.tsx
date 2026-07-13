'use client';

const events = [
  { name: 'Amazon OA',             date: 'Oct 26', dot: '#ffb347', type: 'OA',        typePill: 'pill-amber' },
  { name: 'Microsoft Interview',   date: 'Oct 29', dot: '#00d4ff', type: 'Interview',  typePill: 'pill-cyan' },
  { name: 'TCS Pre-placement talk',date: 'Nov 2',  dot: '#00e5a0', type: 'Talk',       typePill: 'pill-green' },
  { name: 'Google STEP Deadline',  date: 'Nov 10', dot: '#ff4d6d', type: 'Deadline',   typePill: 'pill-red' },
  { name: 'Flipkart FSMK Round',   date: 'Nov 15', dot: '#9d5bf5', type: 'OA',        typePill: 'pill-violet' },
];

export default function UpcomingEventsWidget() {
  return (
    <div className="card events-widget">
      <div className="card-header">
        <span className="card-label"><span className="lbl-icon">📅</span> Upcoming Events</span>
        <button
          className="btn btn-ghost btn-xs"
          id="btn-add-event"
          style={{ borderRadius: '100px' }}
        >
          + Add
        </button>
      </div>
      <div className="card-body">
        {events.map(ev => (
          <div className="event-row" key={ev.name}>
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
    </div>
  );
}
