'use client';
import { useState } from 'react';

const themes = ['Cyberpunk', 'Stark', 'Violet'];
const tags = ['ArmedaSona', 'Spam Detect', 'IoT Sensor'];

export default function PortfolioPreviewWidget() {
  const [activeTheme, setActiveTheme] = useState('Cyberpunk');

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="widget-icon-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
          </svg>
        </div>
        <span className="widget-title">My portfolio</span>
      </div>

      {/* Theme tabs top row */}
      <div className="portfolio-theme-tabs-row">
        {themes.map((t) => (
          <button
            key={t}
            className={`portfolio-theme-tab ${activeTheme === t ? 'active' : ''}`}
            onClick={() => setActiveTheme(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Preview Box */}
      <div className="portfolio-preview-box">
        <div className="portfolio-preview-title">Dynamic UI builder</div>

        <div className="portfolio-tags-row">
          {tags.map((tag) => (
            <span key={tag} className="portfolio-tag-pill">{tag}</span>
          ))}
        </div>

        <div className="portfolio-footer-row">
          <span className="portfolio-link-text">platform.com/anubhab</span>
          <button className="portfolio-share-btn">Share</button>
        </div>
      </div>
    </div>
  );
}
