'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginModal() {
  const { isModalOpen, closeLoginModal, modalMode, login, loginWithProvider } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(modalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email || 'anubhab@nexusprep.io', name || 'Anubhab C.');
      setIsLoading(false);
    }, 800);
  };

  const handleProviderLogin = (provider: 'google' | 'github') => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithProvider(provider);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="auth-modal-overlay" onClick={closeLoginModal}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-modal-close" onClick={closeLoginModal} aria-label="Close modal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="auth-modal-title">Welcome to PlacementHub</h2>
          <p className="auth-modal-subtitle">
            {activeTab === 'login'
              ? 'Sign in to access your interview prep & live study rooms'
              : 'Create your account to start your placement journey'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Social Buttons */}
        <div className="auth-social-btns">
          <button
            className="auth-social-btn"
            onClick={() => handleProviderLogin('google')}
            disabled={isLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            Continue with Google
          </button>
          <button
            className="auth-social-btn"
            onClick={() => handleProviderLogin('github')}
            disabled={isLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="auth-divider">
          <span>or email</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {activeTab === 'signup' && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Anubhab Chakraborty"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={activeTab === 'signup'}
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="anubhab@nexusprep.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <div className="auth-field-header">
              <label>Password</label>
              {activeTab === 'login' && (
                <a href="#forgot" className="auth-link" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              )}
            </div>
            <div className="auth-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-violet auth-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="auth-spinner-wrap">
                <span className="auth-spinner" /> Authenticating...
              </span>
            ) : activeTab === 'login' ? (
              'Log In to PlacementHub'
            ) : (
              'Create Free Account'
            )}
          </button>
        </form>

        <p className="auth-terms-note">
          By signing up, you agree to PlacementHub&apos;s <a href="#terms">Terms</a> and{' '}
          <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
