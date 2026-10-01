'use client';

// Create a realistic contribution graph grid (7 rows x 40 columns)
const gridRows = 7;
const gridCols = 38;

// Seed-based intensity pattern
function getCellOpacity(r: number, c: number) {
  const v = ((r * 13 + c * 37 + 17) % 100);
  if (v > 85) return '0.9';
  if (v > 65) return '0.6';
  if (v > 45) return '0.35';
  if (v > 30) return '0.2';
  return '0.06';
}

export default function ContributionGraphWidget() {
  return (
    <div className="dashboard-widget-card" style={{ width: '100%' }}>
      <div className="widget-header">
        <div className="widget-icon-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span className="widget-title">Daily streak</span>

        <div className="streak-pills-container">
          <span className="streak-pill-tag">21 days current</span>
          <span className="streak-pill-tag">Best 34</span>
        </div>
      </div>

      <div className="contrib-graph-wrapper">
        <div className="contrib-grid">
          {Array.from({ length: gridCols }).map((_, col) => (
            <div key={col} className="contrib-col">
              {Array.from({ length: gridRows }).map((_, row) => {
                const op = getCellOpacity(row, col);
                return (
                  <div
                    key={row}
                    className="contrib-cell"
                    style={{
                      background: op === '0.06' ? 'rgba(255, 255, 255, 0.05)' : '#7C3AED',
                      opacity: op,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
