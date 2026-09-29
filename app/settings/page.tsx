'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

type TabType = 'profile' | 'integrations' | 'preferences' | 'security';

interface UserSettings {
  name: string;
  email: string;
  username: string;
  bio: string;
  targetRole: string;
  targetCompany: string;
  githubUser: string;
  leetcodeUser: string;
  linkedinUrl: string;
  primaryLang: string;
  editorTheme: string;
  autoSaveCode: boolean;
  dailyReminder: boolean;
  aiCoachingLevel: string;
  judge0Key: string;
  geminiKey: string;
  githubToken: string;
}

export default function SettingsPage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const [settings, setSettings] = useState<UserSettings>({
    name: user?.name || 'Anubhab Chakraborty',
    email: user?.email || 'anubhab@nexusprep.io',
    username: 'anubhab-cloud',
    bio: 'CS Student & Competitive Programmer targeting SDE 1 roles.',
    targetRole: 'Software Development Engineer (SDE-1)',
    targetCompany: 'Google, Microsoft, Meta',
    githubUser: 'anubhab-cloud',
    leetcodeUser: 'anubhab_dev',
    linkedinUrl: 'https://linkedin.com/in/anubhab-chakraborty',
    primaryLang: 'cpp',
    editorTheme: 'vs-dark',
    autoSaveCode: true,
    dailyReminder: true,
    aiCoachingLevel: 'proactive',
    judge0Key: '',
    geminiKey: '',
    githubToken: '',
  });

  // Sync user details on load
  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
    const saved = localStorage.getItem('placementhub_settings');
    if (saved) {
      try {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        // use default
      }
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('placementhub_settings', JSON.stringify(settings));
    login(settings.email, settings.name);
    showToast('✨ Settings updated successfully!');
  };

  const toggleShowKey = (keyName: string) => {
    setShowKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 ${label} copied to clipboard!`);
  };

  return (
    <div className="settings-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="settings-toast-banner">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            ⚙ Account <span className="glow-text-violet">Settings</span>
          </h1>
          <p className="page-subtitle">Manage your profile, API keys, platform preferences, and integrations</p>
        </div>
        <button className="btn btn-violet" onClick={() => handleSave()}>
          Save All Changes
        </button>
      </div>

      {/* Main Settings Card Layout */}
      <div className="settings-layout-card">
        {/* Settings Navigation Tabs */}
        <div className="settings-nav-sidebar">
          <button
            className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Profile & Bio
          </button>
          <button
            className={`settings-nav-btn ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            API & Integrations
          </button>
          <button
            className={`settings-nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Workspace Preferences
          </button>
          <button
            className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Security & Account
          </button>
        </div>

        {/* Settings Tab Content */}
        <div className="settings-content-area">
          {/* TAB 1: PROFILE & BIO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="settings-form-grid">
              <div className="settings-section-header">
                <h3 className="settings-section-title">Personal Information</h3>
                <p className="settings-section-desc">Update your name, bio, and target interview goals.</p>
              </div>

              {/* Avatar Preview Row */}
              <div className="settings-avatar-row">
                <div className="settings-big-avatar">{settings.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="avatar-title">{settings.name}</div>
                  <div className="avatar-subtitle">Pro Aspirant · PlacementHub Verified</div>
                  <button type="button" className="btn btn-ghost btn-xs mt-2" onClick={() => showToast('Avatar is auto-generated from your initials!')}>
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="settings-field-row">
                <div className="settings-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="settings-field-row">
                <div className="settings-field">
                  <label>Target Role</label>
                  <input
                    type="text"
                    placeholder="SDE 1 / Full Stack Engineer"
                    value={settings.targetRole}
                    onChange={(e) => setSettings({ ...settings, targetRole: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label>Target Companies</label>
                  <input
                    type="text"
                    placeholder="Google, Microsoft, Amazon"
                    value={settings.targetCompany}
                    onChange={(e) => setSettings({ ...settings, targetCompany: e.target.value })}
                  />
                </div>
              </div>

              <div className="settings-field">
                <label>Bio / Summary</label>
                <textarea
                  rows={3}
                  value={settings.bio}
                  onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                  placeholder="Tell recruiters and peers about your tech stack and goals..."
                />
              </div>

              <div className="settings-section-header mt-4">
                <h3 className="settings-section-title">Coding Handles & Social Profiles</h3>
                <p className="settings-section-desc">Link your LeetCode and GitHub to enable automatic portfolio sync.</p>
              </div>

              <div className="settings-field-row">
                <div className="settings-field">
                  <label>GitHub Username</label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">github.com/</span>
                    <input
                      type="text"
                      value={settings.githubUser}
                      onChange={(e) => setSettings({ ...settings, githubUser: e.target.value })}
                    />
                  </div>
                </div>
                <div className="settings-field">
                  <label>LeetCode Username</label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">leetcode.com/</span>
                    <input
                      type="text"
                      value={settings.leetcodeUser}
                      onChange={(e) => setSettings({ ...settings, leetcodeUser: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-action-bar">
                <button type="submit" className="btn btn-violet">
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: API INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="settings-form-grid">
              <div className="settings-section-header">
                <h3 className="settings-section-title">Integrations & API Credentials</h3>
                <p className="settings-section-desc">
                  Configure API keys to enable code compilation, AI coaching, and automatic GitHub pushes.
                </p>
              </div>

              {/* Judge0 API Key */}
              <div className="integration-item-card">
                <div className="integration-item-header">
                  <div className="integration-item-icon cyan">⚙</div>
                  <div className="integration-item-info">
                    <div className="integration-item-title">
                      Judge0 Code Execution API
                      <span className="status-chip ok">Active Ready</span>
                    </div>
                    <div className="integration-item-desc">Executes C++, Java, Python, and JavaScript in sandbox.</div>
                  </div>
                </div>
                <div className="integration-item-body">
                  <label className="key-label">JUDGE0_API_KEY (RapidAPI)</label>
                  <div className="key-input-wrap">
                    <input
                      type={showKeys['judge0'] ? 'text' : 'password'}
                      placeholder="Paste Judge0 RapidAPI Key..."
                      value={settings.judge0Key}
                      onChange={(e) => setSettings({ ...settings, judge0Key: e.target.value })}
                    />
                    <button type="button" className="btn btn-ghost btn-xs" onClick={() => toggleShowKey('judge0')}>
                      {showKeys['judge0'] ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Gemini AI Key */}
              <div className="integration-item-card">
                <div className="integration-item-header">
                  <div className="integration-item-icon violet">🤖</div>
                  <div className="integration-item-info">
                    <div className="integration-item-title">
                      Google Gemini AI Key
                      <span className="status-chip ok">Demo Mode Active</span>
                    </div>
                    <div className="integration-item-desc">Powers the floating personal coach and mock interview agent.</div>
                  </div>
                </div>
                <div className="integration-item-body">
                  <label className="key-label">GEMINI_API_KEY (Google AI Studio)</label>
                  <div className="key-input-wrap">
                    <input
                      type={showKeys['gemini'] ? 'text' : 'password'}
                      placeholder="AIzaSy..."
                      value={settings.geminiKey}
                      onChange={(e) => setSettings({ ...settings, geminiKey: e.target.value })}
                    />
                    <button type="button" className="btn btn-ghost btn-xs" onClick={() => toggleShowKey('gemini')}>
                      {showKeys['gemini'] ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              {/* GitHub Personal Access Token */}
              <div className="integration-item-card">
                <div className="integration-item-header">
                  <div className="integration-item-icon green">🐙</div>
                  <div className="integration-item-info">
                    <div className="integration-item-title">
                      GitHub Auto-Push Token
                      <span className="status-chip ok">Connected</span>
                    </div>
                    <div className="integration-item-desc">Automatically commits solved problems to your repository.</div>
                  </div>
                </div>
                <div className="integration-item-body">
                  <label className="key-label">GITHUB_TOKEN (Personal Access Token)</label>
                  <div className="key-input-wrap">
                    <input
                      type={showKeys['github'] ? 'text' : 'password'}
                      placeholder="ghp_..."
                      value={settings.githubToken}
                      onChange={(e) => setSettings({ ...settings, githubToken: e.target.value })}
                    />
                    <button type="button" className="btn btn-ghost btn-xs" onClick={() => toggleShowKey('github')}>
                      {showKeys['github'] ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              {/* .env.local Template Box */}
              <div className="env-template-box">
                <div className="env-box-header">
                  <span>📄 .env.local Configuration File</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() =>
                      copyToClipboard(
                        `JUDGE0_API_KEY=${settings.judge0Key || 'your_key'}\nGEMINI_API_KEY=${settings.geminiKey || 'your_key'}\nGITHUB_TOKEN=${settings.githubToken || 'your_token'}`,
                        '.env.local Config'
                      )
                    }
                  >
                    Copy Template
                  </button>
                </div>
                <pre className="env-code">
{`# Judge0 Compiler Key
JUDGE0_API_KEY=${settings.judge0Key || 'your_rapidapi_key_here'}
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# Gemini AI Key
GEMINI_API_KEY=${settings.geminiKey || 'your_gemini_api_key_here'}

# GitHub Integration
GITHUB_TOKEN=${settings.githubToken || 'ghp_your_token_here'}
GITHUB_USERNAME=${settings.githubUser}`}
                </pre>
              </div>

              <div className="form-action-bar">
                <button type="button" className="btn btn-violet" onClick={() => handleSave()}>
                  Save API Keys
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: WORKSPACE PREFERENCES */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSave} className="settings-form-grid">
              <div className="settings-section-header">
                <h3 className="settings-section-title">IDE & Workspace Preferences</h3>
                <p className="settings-section-desc">Customize code editor defaults, compiler options, and AI assistant behavior.</p>
              </div>

              <div className="settings-field-row">
                <div className="settings-field">
                  <label>Primary Language</label>
                  <select
                    value={settings.primaryLang}
                    onChange={(e) => setSettings({ ...settings, primaryLang: e.target.value })}
                  >
                    <option value="cpp">C++ (GCC 11.2)</option>
                    <option value="python">Python 3.10</option>
                    <option value="java">Java 17 OpenJDK</option>
                    <option value="javascript">JavaScript (Node.js 20)</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label>Code Editor Theme</label>
                  <select
                    value={settings.editorTheme}
                    onChange={(e) => setSettings({ ...settings, editorTheme: e.target.value })}
                  >
                    <option value="vs-dark">VS Code Dark (Default)</option>
                    <option value="monokai">Monokai Pro</option>
                    <option value="one-dark">One Dark Pro</option>
                    <option value="github-dark">GitHub Dark High Contrast</option>
                  </select>
                </div>
              </div>

              <div className="settings-field">
                <label>AI Assistant Proactivity</label>
                <select
                  value={settings.aiCoachingLevel}
                  onChange={(e) => setSettings({ ...settings, aiCoachingLevel: e.target.value })}
                >
                  <option value="proactive">Proactive (Suggests hints when stuck)</option>
                  <option value="on-demand">On Demand (Only responds when asked)</option>
                  <option value="strict">Strict Interview Mode (No hints until submission)</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-label">Auto-save Code Workspace</div>
                  <div className="toggle-desc">Automatically persist draft solutions as you type.</div>
                </div>
                <input
                  type="checkbox"
                  className="settings-checkbox"
                  checked={settings.autoSaveCode}
                  onChange={(e) => setSettings({ ...settings, autoSaveCode: e.target.checked })}
                />
              </div>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-label">Daily Problem Reminders</div>
                  <div className="toggle-desc">Receive notifications to maintain your daily solving streak.</div>
                </div>
                <input
                  type="checkbox"
                  className="settings-checkbox"
                  checked={settings.dailyReminder}
                  onChange={(e) => setSettings({ ...settings, dailyReminder: e.target.checked })}
                />
              </div>

              <div className="form-action-bar">
                <button type="submit" className="btn btn-violet">
                  Save Preferences
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: SECURITY & ACCOUNT */}
          {activeTab === 'security' && (
            <div className="settings-form-grid">
              <div className="settings-section-header">
                <h3 className="settings-section-title">Security & Session Management</h3>
                <p className="settings-section-desc">Manage your password, active browser sessions, and export options.</p>
              </div>

              <div className="settings-field">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" />
              </div>

              <div className="settings-field-row">
                <div className="settings-field">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="settings-field">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm align-self-start"
                onClick={() => showToast('Password updated successfully!')}
              >
                Update Password
              </button>

              <div className="settings-section-header mt-4">
                <h3 className="settings-section-title">Danger Zone</h3>
                <p className="settings-section-desc">Irreversible account actions.</p>
              </div>

              <div className="danger-zone-box">
                <div className="danger-zone-row">
                  <div>
                    <div className="danger-zone-title">Clear Local Progress Cache</div>
                    <div className="danger-zone-desc">Resets local problem stats cache and restores default state.</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-red"
                    onClick={() => {
                      localStorage.clear();
                      showToast('Local cache cleared successfully.');
                    }}
                  >
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
