'use client';
import { useState, useEffect, useRef } from 'react';

/* ── Data Generation ─────────────────────────────────────────────────────── */
type Day = { date: Date; count: number; level: 0 | 1 | 2 | 3 | 4 };

function generateData(): Day[] {
  const days: Day[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Go back 364 days (52 weeks)
  const start = new Date(today);
  start.setDate(start.getDate() - 363);

  // Seed-based pseudo-random for consistent look
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Generate activity clusters (realistic pattern)
  const hotDays = new Set<number>();
  // Main activity burst — last 60 days more active
  for (let i = 0; i < 364; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const daysAgo = Math.floor((today.getTime() - d.getTime()) / 86400000);
    const recencyBoost = daysAgo < 60 ? 2.0 : daysAgo < 120 ? 1.4 : 1.0;
    const weekday = d.getDay();
    const weekdayBoost = weekday === 0 || weekday === 6 ? 0.7 : 1.2; // less on weekends
    if (rand() < 0.52 * recencyBoost * weekdayBoost * 0.45) hotDays.add(i);
  }

  for (let i = 0; i < 364; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const isHot = hotDays.has(i);
    let count = 0;
    if (isHot) {
      const raw = rand();
      count = raw < 0.4 ? Math.ceil(rand() * 3) : raw < 0.75 ? Math.ceil(rand() * 6) + 2 : Math.ceil(rand() * 12) + 5;
    }
    const level: 0 | 1 | 2 | 3 | 4 =
      count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4;

    days.push({ date: d, count, level });
  }
  return days;
}

const DAYS = generateData();

/* ── Color Levels (indigo-to-violet gradient) ────────────────────────────── */
const LEVEL_COLORS = [
  'rgba(255,255,255,0.04)',   // 0 - empty
  'rgba(99,91,255,0.25)',     // 1 - low
  'rgba(99,91,255,0.48)',     // 2 - medium
  'rgba(139,133,255,0.72)',   // 3 - high
  '#8b85ff',                  // 4 - max
];
const LEVEL_GLOWS = [
  'none',
  'none',
  '0 0 6px rgba(99,91,255,0.3)',
  '0 0 8px rgba(139,133,255,0.5)',
  '0 0 12px rgba(139,133,255,0.7)',
];

/* ── Month Labels ─────────────────────────────────────────────────────────── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

/* ── Stats ────────────────────────────────────────────────────────────────── */
function computeStats(days: Day[]) {
  const total = days.reduce((s, d) => s + d.count, 0);
  let streak = 0, maxStreak = 0, cur = 0;
  const rev = [...days].reverse();
  for (const d of rev) {
    if (d.count > 0) { cur++; maxStreak = Math.max(maxStreak, cur); }
    else cur = 0;
  }
  // current streak from today backwards
  for (const d of rev) {
    if (d.count > 0) streak++;
    else break;
  }
  const activeDays = days.filter(d => d.count > 0).length;
  return { total, streak, maxStreak, activeDays };
}

const STATS = computeStats(DAYS);

/* ── Tooltip ─────────────────────────────────────────────────────────────── */
type TooltipState = { day: Day; x: number; y: number } | null;

/* ── Weeks array (52 cols × 7 rows) ──────────────────────────────────────── */
function buildWeeks(): Day[][] {
  const weeks: Day[][] = [];
  const startDow = DAYS[0].date.getDay(); // day of week of first day
  let week: Day[] = new Array(startDow).fill(null);
  for (const d of DAYS) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null as any);
    weeks.push(week);
  }
  return weeks;
}

const WEEKS = buildWeeks();

/* ── Month position helper ────────────────────────────────────────────────── */
function getMonthPositions() {
  const positions: { label: string; col: number }[] = [];
  let lastMonth = -1;
  WEEKS.forEach((week, wi) => {
    const validDay = week.find(d => d);
    if (!validDay) return;
    const m = validDay.date.getMonth();
    if (m !== lastMonth) { positions.push({ label: MONTHS[m], col: wi }); lastMonth = m; }
  });
  return positions;
}

/* ── Main Widget ─────────────────────────────────────────────────────────── */
export default function ContributionGraphWidget() {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [animated, setAnimated] = useState(false);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stagger animation on mount
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const monthPositions = getMonthPositions();

  const handleMouseEnter = (day: Day, e: React.MouseEvent) => {
    if (!day) return;
    setTooltip({ day, x: e.clientX, y: e.clientY });
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="card contrib-widget" ref={containerRef} style={{ position: 'relative', overflow: 'visible' }}>
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="card-header">
        <span className="card-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Activity Graph
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '10px', color: 'var(--text-3)', fontWeight: 500,
            background: 'var(--bg-card-2)', border: '1px solid var(--border)',
            padding: '2px 8px', borderRadius: 'var(--r-pill)',
          }}>
            Last 12 months
          </span>
          <button className="card-menu" id="btn-contrib-menu">···</button>
        </div>
      </div>

      <div className="card-body">
        {/* ── Stats Row ──────────────────────────────────────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px', marginBottom: '20px',
        }}>
          {[
            { label: 'Total Contributions', value: STATS.total.toLocaleString(), color: 'var(--accent-2)', icon: '⚡' },
            { label: 'Current Streak',      value: `${STATS.streak}d`,           color: 'var(--amber)',    icon: '🔥' },
            { label: 'Longest Streak',      value: `${STATS.maxStreak}d`,        color: 'var(--green)',   icon: '🏆' },
            { label: 'Active Days',          value: STATS.activeDays.toString(),  color: 'var(--cyan)',    icon: '📅' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '10px 12px',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-md)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '4px' }}>
                {s.icon} {s.label}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Graph ──────────────────────────────────────────────── */}
        <div style={{ overflowX: 'auto', overflowY: 'visible', paddingBottom: '4px' }}>
          <div style={{ display: 'flex', gap: '12px', minWidth: 'max-content' }}>
            {/* Day labels */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '2px',
              paddingTop: '22px', flexShrink: 0,
            }}>
              {DAY_LABELS.map((lbl, i) => (
                <div key={i} style={{
                  height: '11px', fontSize: '9px', color: 'var(--text-3)',
                  lineHeight: '11px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace",
                  minWidth: '24px',
                }}>
                  {lbl}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div style={{ flex: 1 }}>
              {/* Month labels */}
              <div style={{ display: 'flex', marginBottom: '6px', position: 'relative', height: '16px' }}>
                {monthPositions.map((m, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    left: `${m.col * 13}px`,
                    fontSize: '9px', color: 'var(--text-3)',
                    fontWeight: 600, letterSpacing: '0.3px',
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: 'nowrap',
                  }}>
                    {m.label}
                  </div>
                ))}
              </div>

              {/* Cell grid */}
              <div style={{ display: 'flex', gap: '2px' }}>
                {WEEKS.map((week, wi) => (
                  <div
                    key={wi}
                    style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
                    onMouseEnter={() => setHoveredWeek(wi)}
                    onMouseLeave={() => setHoveredWeek(null)}
                  >
                    {week.map((day, di) => {
                      if (!day) return (
                        <div key={di} style={{ width: '11px', height: '11px' }} />
                      );
                      const delay = animated ? 0 : wi * 12 + di * 2;
                      return (
                        <div
                          key={di}
                          onMouseEnter={(e) => handleMouseEnter(day, e)}
                          onMouseLeave={() => setTooltip(null)}
                          style={{
                            width: '11px', height: '11px',
                            borderRadius: '2px',
                            background: LEVEL_COLORS[day.level],
                            boxShadow: hoveredWeek === wi ? LEVEL_GLOWS[day.level] : LEVEL_GLOWS[Math.max(0, day.level - 1)],
                            cursor: day.count > 0 ? 'pointer' : 'default',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
                            transform: tooltip?.day === day ? 'scale(1.4)' : hoveredWeek === wi ? 'scale(1.05)' : 'scale(1)',
                            opacity: animated ? 1 : 0,
                            animation: animated ? 'none' : `cellFadeIn 0.4s ease forwards ${delay}ms`,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            marginTop: '10px', justifyContent: 'flex-end',
          }}>
            <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>Less</span>
            {LEVEL_COLORS.map((c, i) => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '2px',
                background: c,
                boxShadow: LEVEL_GLOWS[i] !== 'none' ? LEVEL_GLOWS[i] : undefined,
              }} />
            ))}
            <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>More</span>
          </div>
        </div>

        {/* ── Activity Bars (last 7 days breakdown) ─────────────── */}
        <div style={{
          marginTop: '18px', paddingTop: '16px',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Last 7 Days
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '48px' }}>
            {DAYS.slice(-7).map((day, i) => {
              const maxCount = Math.max(...DAYS.slice(-7).map(d => d.count), 1);
              const pct = Math.max((day.count / maxCount) * 100, day.count > 0 ? 8 : 0);
              const isToday = i === 6;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%' }}>
                  <div style={{
                    flex: 1, width: '100%', display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-end', position: 'relative',
                  }}>
                    <div style={{
                      height: `${pct}%`,
                      background: isToday ? 'var(--grad-accent)' : 'rgba(99,91,255,0.35)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                      boxShadow: isToday ? '0 0 12px rgba(99,91,255,0.5)' : undefined,
                      minHeight: day.count > 0 ? '3px' : '0',
                    }} />
                  </div>
                  <div style={{
                    fontSize: '8px', color: isToday ? 'var(--accent-2)' : 'var(--text-3)',
                    fontWeight: isToday ? 700 : 400,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {['S','M','T','W','T','F','S'][day.date.getDay()]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tooltip ───────────────────────────────────────────────── */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 12,
          top: tooltip.y - 64,
          pointerEvents: 'none',
          zIndex: 9999,
          background: 'var(--bg-card-2)',
          border: '1px solid var(--border-md)',
          borderRadius: 'var(--r-md)',
          padding: '7px 11px',
          boxShadow: 'var(--shadow-md)',
          whiteSpace: 'nowrap',
          animation: 'tooltipIn 0.15s ease',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-1)' }}>
            {tooltip.day.count === 0 ? 'No activity' : `${tooltip.day.count} contribution${tooltip.day.count !== 1 ? 's' : ''}`}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
            {formatDate(tooltip.day.date)}
          </div>
          {tooltip.day.count > 0 && (
            <div style={{ display: 'flex', gap: '3px', marginTop: '5px' }}>
              {Array.from({ length: Math.min(tooltip.day.count, 8) }).map((_, i) => (
                <div key={i} style={{
                  width: '5px', height: '5px', borderRadius: '1px',
                  background: LEVEL_COLORS[tooltip.day.level],
                  boxShadow: LEVEL_GLOWS[tooltip.day.level],
                }} />
              ))}
              {tooltip.day.count > 8 && (
                <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>+{tooltip.day.count - 8}</span>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes cellFadeIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
