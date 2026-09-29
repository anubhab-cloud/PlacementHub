'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { openLoginModal, login } = useAuth();

  const handleDemoAccess = () => {
    login('anubhab@nexusprep.io', 'Anubhab C.');
  };

  return (
    <div className="landing-container">
      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <header className="landing-header">
        <div className="landing-brand">
          <div className="brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="brand-name">PlacementHub</span>
          <span className="brand-badge">PRO</span>
        </div>

        <nav className="landing-nav">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#ai-coach" className="landing-nav-link">AI Coach</a>
          <a href="#digital-library" className="landing-nav-link">Study Library</a>
          <a href="#testimonials" className="landing-nav-link">Reviews</a>
        </nav>

        <div className="landing-header-actions">
          <button className="btn btn-ghost" onClick={() => openLoginModal('login')}>
            Log In
          </button>
          <button className="btn btn-violet" onClick={() => openLoginModal('signup')}>
            Get Started Free
          </button>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="hero-glow-bg" />
        <div className="hero-badge">
          <span className="badge-pulse" />
          <span>⚡ PlacementHub 2.0 is Live · AI Interview Coaching & Digital Library</span>
        </div>

        <h1 className="hero-title">
          Crack Top Tech Offers with <br />
          <span className="glow-text-violet">AI Coaching & Live Study Hub</span>
        </h1>

        <p className="hero-subtitle">
          The all-in-one placement prep platform. Track DSA progress, simulate live mock interviews with Gemini AI, join live collaborative study rooms, and generate a verified developer portfolio.
        </p>

        <div className="hero-ctas">
          <button className="btn btn-violet hero-btn-lg" onClick={() => openLoginModal('signup')}>
            Start Preparing Free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button className="btn btn-ghost hero-btn-lg" onClick={handleDemoAccess}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Instant Live Demo
          </button>
        </div>

        {/* Live Metrics Ticker */}
        <div className="hero-stats-row">
          <div className="hero-stat-item">
            <span className="stat-value glow-text-violet">15,000+</span>
            <span className="stat-label">Problems Solved</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-item">
            <span className="stat-value glow-text-cyan">94%</span>
            <span className="stat-label">Interview Pass Rate</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-item">
            <span className="stat-value glow-text-violet">21 Days</span>
            <span className="stat-label">Avg. Prep Streak</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-item">
            <span className="stat-value glow-text-cyan">50+</span>
            <span className="stat-label">Campus Placement Hubs</span>
          </div>
        </div>

        {/* Interactive Dashboard Preview Graphic */}
        <div className="hero-preview-frame">
          <div className="preview-topbar">
            <div className="preview-dots">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
            </div>
            <div className="preview-url">nexusprep.io/dashboard/anubhab</div>
          </div>
          <div className="preview-body">
            <div className="preview-card-grid">
              <div className="preview-card">
                <div className="pcard-label">DSA PREP TRACKER</div>
                <div className="pcard-val">245 / 300 Solved</div>
                <div className="pcard-progress"><div className="pcard-bar" style={{ width: '82%' }} /></div>
              </div>
              <div className="preview-card highlight">
                <div className="pcard-label">AI INTERVIEW COACH</div>
                <div className="pcard-val">&ldquo;Practice Graph BFS & Dynamic Programming&rdquo;</div>
              </div>
              <div className="preview-card">
                <div className="pcard-label">STUDY LIBRARY</div>
                <div className="pcard-val">4 Study Rooms Active</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Showcase Grid ──────────────────────────────────────── */}
      <section className="landing-features" id="features">
        <div className="section-header">
          <span className="section-tag">ENGINEERED FOR SUCCESS</span>
          <h2 className="section-title">Everything you need to land your dream offer</h2>
          <p className="section-desc">Designed with high aesthetics and actionable analytics for CS students and self-taught developers.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap violet">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h3 className="feature-card-title">DSA Practice Workspace</h3>
            <p className="feature-card-desc">Comprehensive LeetCode/Codeforces tracking, topic heatmaps, and customizable code editor runtime.</p>
          </div>

          <div className="feature-card" id="ai-coach">
            <div className="feature-icon-wrap cyan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
              </svg>
            </div>
            <h3 className="feature-card-title">Floating AI Personal Agent</h3>
            <p className="feature-card-desc">Powered by Gemini 1.5. Ask real-time questions, review error logs, and get mock interview feedback on any page.</p>
          </div>

          <div className="feature-card" id="digital-library">
            <div className="feature-icon-wrap green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h3 className="feature-card-title">Digital Study Library</h3>
            <p className="feature-card-desc">Live collaborative study rooms, built-in Pomodoro timer, shared note pads, and video resources.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h3 className="feature-card-title">University Placement Hub</h3>
            <p className="feature-card-desc">Track ongoing campus drive schedules, company cut-offs, eligibility criteria, and OA deadlines.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap violet">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <h3 className="feature-card-title">Developer Portfolio Generator</h3>
            <p className="feature-card-desc">Auto-generate a sleek, shareable public portfolio highlighting your DSA stats, GitHub activity, and projects.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap cyan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3 className="feature-card-title">Contribution Analytics</h3>
            <p className="feature-card-desc">GitHub-style submission graph tracking your daily problem solving consistency and streaks.</p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="landing-testimonials" id="testimonials">
        <div className="section-header">
          <span className="section-tag">PROVEN RESULTS</span>
          <h2 className="section-title">Loved by students placed at top companies</h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              &ldquo;The AI coach helped me catch edge cases in Graph BFS problems I usually missed. Landed an offer at Microsoft!&rdquo;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">RD</div>
              <div>
                <div className="author-name">Rohan Das</div>
                <div className="author-role">Software Engineer @ Microsoft</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              &ldquo;The Live Digital Library pomodoro sessions kept me consistent during campus placements. Solved 150+ problems in 1 month.&rdquo;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">PS</div>
              <div>
                <div className="author-name">Priya Sharma</div>
                <div className="author-role">Frontend Engineer @ Uber</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              &ldquo;PlacementHub&apos;s auto-generated portfolio link in my resume got direct recruiter attention. Best platform for CS grads.&rdquo;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">AK</div>
              <div>
                <div className="author-name">Arjun Kumar</div>
                <div className="author-role">SDE Intern @ Amazon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="landing-cta-banner">
        <div className="cta-banner-card">
          <h2 className="cta-banner-title">Ready to land your dream tech job?</h2>
          <p className="cta-banner-desc">Join thousands of students building consistency and cracking top coding interviews.</p>
          <div className="cta-banner-actions">
            <button className="btn btn-violet hero-btn-lg" onClick={() => openLoginModal('signup')}>
              Create Your Free Account
            </button>
            <button className="btn btn-ghost hero-btn-lg" onClick={handleDemoAccess}>
              Explore Demo Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span>PlacementHub</span>
          </div>
          <div className="footer-copy">© 2026 PlacementHub / NexusPrep. Built for engineering candidates worldwide.</div>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
