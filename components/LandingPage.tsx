'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, BookOpen, Building2, Code2, Github, Moon, Play, Sparkles, Sun } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI interview coach',
    description: 'Simulate live mock interviews with Gemini AI. It finds your weak topics, such as graph traversal or DP, and builds a daily plan around them with instant feedback on your answers.',
    featured: true,
    id: 'coach',
  },
  {
    icon: Code2,
    title: 'DSA progress tracker',
    description: 'Easy, medium and hard counts, streaks and a heatmap that keeps you honest.',
  },
  {
    icon: Building2,
    title: 'Company directory',
    description: 'Round structures, package ranges, past questions and a readiness score for each target company.',
  },
  {
    icon: BookOpen,
    title: 'Virtual study library',
    description: 'Join a quiet community hall or open a private room. Text chat, ask-to-talk permission and focus timers.',
    id: 'library',
  },
  {
    icon: Github,
    title: 'GitHub sync',
    description: 'Push solutions straight from your workspace and keep a clean public record of your work.',
  },
  {
    icon: Sparkles,
    title: 'Verified developer portfolio',
    description: 'Turn your solved problems, projects and streaks into a shareable portfolio page in a few clicks. Pick a theme and send one link to recruiters.',
    featured: true,
  },
];

const steps = [
  ['Pick your targets', 'Choose the companies you want. We load their rounds, topics and past questions.'],
  ['Practice daily', 'Solve problems, run mock interviews and study with peers. Your streak and score update automatically.'],
  ['Show your proof', 'Share your portfolio and walk into interviews knowing exactly where you stand.'],
];

const reviews = [
  ['The readiness score told me what to fix before my Amazon OA. Super clear.', 'R', 'Riya', 'Final year, CSE'],
  ['Study rooms keep me consistent. Quiet, focused, and nobody bothers you.', 'K', 'Karan', 'Third year, ISE'],
  ['The AI coach pushed me on graphs until I stopped dreading them.', 'M', 'Meera', 'Final year, ECE'],
];

export default function LandingPage({ isDarkTheme, onToggleTheme }: { isDarkTheme: boolean; onToggleTheme: () => void }) {
  const { openLoginModal, login } = useAuth();

  const handleDemoAccess = () => login('anubhab@nexusprep.io', 'Anubhab C.');

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="homepage-wrap homepage-nav-row">
          <a className="homepage-brand" href="#top" aria-label="PlacementHub home">
            <span className="homepage-logo">P</span>
            <span>PlacementHub</span>
            <span className="homepage-pro">PRO</span>
          </a>
          <nav className="homepage-links" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#coach">AI Coach</a>
            <a href="#library">Study Library</a>
            <a href="#reviews">Reviews</a>
          </nav>
          <div className="homepage-actions">
            <button className="homepage-theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`} title={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}>
              {isDarkTheme ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="homepage-button homepage-button-small" onClick={() => openLoginModal('login')}>Log in</button>
            <button className="homepage-button homepage-button-primary homepage-button-small" onClick={() => openLoginModal('signup')}>Get started free</button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="homepage-wrap homepage-hero">
          <span className="homepage-pill"><i className="homepage-dot" />PlacementHub 2.0 is live: AI interview coaching and a digital library</span>
          <h1>Crack top tech offers with <span className="homepage-mark">AI coaching</span> and a live study hub</h1>
          <p className="homepage-lead">The all-in-one placement prep platform. Track DSA progress, run mock interviews with Gemini AI, join live study rooms, and generate a verified developer portfolio.</p>
          <div className="homepage-ctas" id="start">
            <button className="homepage-button homepage-button-primary" onClick={() => openLoginModal('signup')}>Start preparing free <ArrowRight size={17} /></button>
            <button className="homepage-button" onClick={handleDemoAccess}><Play size={15} /> Instant live demo</button>
          </div>

          <div className="homepage-stats" aria-label="PlacementHub results">
            <div><b>15,000+</b><span>Problems solved</span></div>
            <div><b>94%</b><span>Interview pass rate</span></div>
            <div><b>21 days</b><span>Average prep streak</span></div>
            <div><b>50+</b><span>Campus placement hubs</span></div>
          </div>

          <div className="homepage-preview" aria-label="PlacementHub dashboard preview">
            <div className="homepage-preview-bar"><i /><i /><i /><code>placementhub.app/dashboard/anubhab</code></div>
            <div className="homepage-preview-grid">
              <article className="homepage-preview-card">
                <small>DSA prep tracker</small>
                <b>245 / 300 solved</b>
                <div className="homepage-track"><i style={{ width: '82%' }} /></div>
              </article>
              <article className="homepage-preview-card">
                <small>AI interview coach</small>
                <b>Practice graph BFS and dynamic programming</b>
                <div className="homepage-track"><i style={{ width: '60%' }} /></div>
              </article>
              <article className="homepage-preview-card">
                <small>Study library</small>
                <b>4 study rooms active</b>
                <div className="homepage-faces"><span>R</span><span>K</span><span>M</span><span>A</span></div>
              </article>
            </div>
            <span className="homepage-streak">21-day streak</span>
          </div>
        </section>

        <section className="homepage-wrap homepage-section" id="features">
          <div className="homepage-section-heading">
            <span className="homepage-eyebrow">Everything in one place</span>
            <h2>Built for the whole placement season</h2>
            <p>From your first problem to the final offer letter, every tool talks to the others.</p>
          </div>
          <div className="homepage-feature-grid">
            {features.map(({ icon: Icon, title, description, featured, id }) => (
              <article key={title} id={id} className={`homepage-feature${featured ? ' is-featured' : ''}`}>
                <span className="homepage-feature-icon"><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="homepage-wrap homepage-section">
          <div className="homepage-section-heading">
            <span className="homepage-eyebrow">How it works</span>
            <h2>Three steps to interview-ready</h2>
          </div>
          <div className="homepage-steps">
            {steps.map(([title, description]) => (
              <article className="homepage-step" key={title}><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>

        <section className="homepage-wrap homepage-section" id="reviews">
          <div className="homepage-section-heading">
            <span className="homepage-eyebrow">Reviews</span>
            <h2>Students who stopped guessing</h2>
          </div>
          <div className="homepage-reviews">
            {reviews.map(([quote, initial, name, role]) => (
              <article className="homepage-review" key={name}>
                <div className="homepage-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <p>“{quote}”</p>
                <div className="homepage-review-author"><span>{initial}</span><div><b>{name}</b><small>{role}</small></div></div>
              </article>
            ))}
          </div>
        </section>

        <section className="homepage-wrap homepage-final-cta">
          <div>
            <h2>Your next offer starts today</h2>
            <p>Free to start. Connect GitHub, pick your target companies and begin your streak.</p>
            <button className="homepage-button" onClick={() => openLoginModal('signup')}>Start preparing free <ArrowRight size={17} /></button>
          </div>
        </section>
      </main>

    </div>
  );
}
