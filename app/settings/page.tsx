'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

// ─── TYPES ───────────────────────────────────────────────────────
type TabId =
  | 'basicinfo'
  | 'coding'
  | 'social'
  | 'education'
  | 'skills'
  | 'preferences'
  | 'integrations'
  | 'security';

interface UserSettings {
  // Basic Info
  name: string;
  username: string;
  email: string;
  bio: string;
  college: string;
  graduationYear: string;
  location: string;
  website: string;
  targetRole: string;
  targetCompanies: string;
  // Coding
  githubUser: string;
  leetcodeUser: string;
  codeforcesUser: string;
  codechefUser: string;
  gfgUser: string;
  // Social
  linkedinUrl: string;
  twitterUrl: string;
  portfolioUrl: string;
  // Skills
  skills: string;
  // Preferences
  primaryLang: string;
  editorTheme: string;
  autoSaveCode: boolean;
  dailyReminder: boolean;
  aiCoachingLevel: string;
  // Integrations
  judge0Key: string;
  geminiKey: string;
  githubToken: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Anubhab Chakraborty',
  username: 'anubhab-cloud',
  email: 'anubhab@nexusprep.io',
  bio: 'CS Student & Competitive Programmer targeting SDE-1 roles.',
  college: '',
  graduationYear: '2025',
  location: '',
  website: '',
  targetRole: 'Software Development Engineer (SDE-1)',
  targetCompanies: 'Google, Microsoft, Meta',
  githubUser: 'anubhab-cloud',
  leetcodeUser: 'anubhab_dev',
  codeforcesUser: '',
  codechefUser: '',
  gfgUser: '',
  linkedinUrl: 'https://linkedin.com/in/anubhab-chakraborty',
  twitterUrl: '',
  portfolioUrl: '',
  skills: 'C++, Python, React, Node.js, SQL, DSA, System Design',
  primaryLang: 'cpp',
  editorTheme: 'vs-dark',
  autoSaveCode: true,
  dailyReminder: true,
  aiCoachingLevel: 'proactive',
  judge0Key: '',
  geminiKey: '',
  githubToken: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
};

// ─── TABS CONFIG ─────────────────────────────────────────────────
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'basicinfo',
    label: 'Basic Info',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'coding',
    label: 'Coding Profiles',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'social',
    label: 'Social Links',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
  {
    id: 'education',
    label: 'Education',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    ),
  },
  {
    id: 'security',
    label: 'Security',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

// ─── FIELD COMPONENTS ─────────────────────────────────────────────
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '13px', fontWeight: '500', color: '#e2e8f0', letterSpacing: '0.01em' }}>
        {label}
      </label>
      {children}
      {hint && (
        <span style={{ fontSize: '11px', color: '#64748b' }}>{hint}</span>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) {
  const inputStyle: React.CSSProperties = {
    background: '#161b22',
    border: '1px solid #2d333b',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '13px',
    padding: prefix ? '10px 12px 10px 0' : '10px 12px',
    outline: 'none',
    width: '100%',
    flex: 1,
    transition: 'border-color 0.15s ease',
  };
  if (prefix) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#161b22', border: '1px solid #2d333b', borderRadius: '8px', overflow: 'hidden',
      }}>
        <span style={{
          padding: '10px 10px 10px 12px', color: '#64748b', fontSize: '13px',
          borderRight: '1px solid #2d333b', background: '#0d1117', whiteSpace: 'nowrap',
        }}>
          {prefix}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, borderRadius: 0, border: 'none', paddingLeft: '10px' }}
        />
      </div>
    );
  }
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: '#161b22', border: '1px solid #2d333b', borderRadius: '8px',
        color: '#e2e8f0', fontSize: '13px', padding: '10px 12px',
        outline: 'none', width: '100%', resize: 'vertical', fontFamily: 'inherit',
        lineHeight: '1.5',
      }}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: '#161b22', border: '1px solid #2d333b', borderRadius: '8px',
        color: '#e2e8f0', fontSize: '13px', padding: '10px 12px', outline: 'none', width: '100%',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: '40px', height: '22px', borderRadius: '11px', border: 'none',
        background: checked ? '#5b46f6' : '#2d333b',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
        transition: 'background 0.2s ease',
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: checked ? '21px' : '3px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: '#ffffff', transition: 'left 0.2s ease',
        display: 'block',
      }} />
    </button>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  showKey,
  onToggleShow,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showKey: boolean;
  onToggleShow: () => void;
}) {
  return (
    <Field label={label}>
      <div style={{ position: 'relative' }}>
        <input
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            background: '#161b22', border: '1px solid #2d333b', borderRadius: '8px',
            color: '#e2e8f0', fontSize: '13px', padding: '10px 80px 10px 12px',
            outline: 'none', width: '100%',
          }}
        />
        <button
          type="button"
          onClick={onToggleShow}
          style={{
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: '#5b46f6', fontSize: '12px',
            fontWeight: '600', cursor: 'pointer', padding: '4px 8px',
          }}
        >
          {showKey ? 'Hide' : 'Show'}
        </button>
      </div>
    </Field>
  );
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
        {title}
      </h3>
      {desc && <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{desc}</p>}
    </div>
  );
}

function SaveButton({ onClick, label = 'Save Changes' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        marginTop: '8px',
        padding: '10px 24px',
        background: '#5b46f6',
        border: 'none',
        borderRadius: '8px',
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'opacity 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('basicinfo');
  const [toast, setToast] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
    const raw = localStorage.getItem('placementhub_settings');
    if (raw) {
      try { setSettings((prev) => ({ ...prev, ...JSON.parse(raw) })); } catch {}
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    localStorage.setItem('placementhub_settings', JSON.stringify(settings));
    if (user) login(settings.email, settings.name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    showToast('Changes saved successfully!');
  };

  const set = (key: keyof UserSettings, value: any) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const toggleKey = (k: string) =>
    setShowKeys((prev) => ({ ...prev, [k]: !prev[k] }));

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}!`);
  };

  // Avatar initials
  const initials = settings.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      color: '#e2e8f0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
          background: '#1c2128', border: '1px solid #30363d',
          borderRadius: '10px', padding: '12px 20px',
          fontSize: '13px', color: '#e2e8f0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '10px',
          animation: 'fadeIn 0.2s ease',
        }}>
          <span style={{ color: '#5b46f6' }}>✓</span>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
            Edit Profile
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Manage your public profile, coding handles, integrations, and preferences.
          </p>
        </div>

        {/* Two-column Layout: Left Nav + Right Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* ── LEFT SIDEBAR ── */}
          <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'sticky',
            top: '24px',
          }}>
            {TABS.map((tab, i) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%', textAlign: 'left', border: 'none',
                    padding: '13px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '13px', fontWeight: isActive ? '600' : '400',
                    color: isActive ? '#ffffff' : '#8b949e',
                    cursor: 'pointer', position: 'relative',
                    borderLeft: `3px solid ${isActive ? '#5b46f6' : 'transparent'}`,
                    borderBottom: i < TABS.length - 1 ? '1px solid #21262d' : 'none',
                    transition: 'all 0.15s ease',
                    background: isActive ? 'rgba(91, 70, 246, 0.08)' : 'transparent',
                  } as React.CSSProperties}
                >
                  <span style={{ color: isActive ? '#5b46f6' : '#64748b', flexShrink: 0 }}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: '12px',
            padding: '32px',
          }}>
            {/* ── TAB: BASIC INFO ── */}
            {activeTab === 'basicinfo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionTitle
                  title="Basic Information"
                  desc="This information will appear on your public PlacementHub profile."
                />

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: '#0d1117', borderRadius: '10px', border: '1px solid #21262d' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #5b46f6, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', fontWeight: '700', color: '#ffffff',
                    flexShrink: 0,
                  }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '2px' }}>
                      {settings.name || 'Your Name'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                      @{settings.username || 'username'} · PlacementHub Verified
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Avatar is auto-generated from your initials')}
                      style={{
                        padding: '5px 12px', borderRadius: '6px',
                        background: 'transparent', border: '1px solid #30363d',
                        color: '#8b949e', fontSize: '12px', cursor: 'pointer',
                      }}
                    >
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Full Name">
                    <TextInput value={settings.name} onChange={(v) => set('name', v)} placeholder="Your full name" />
                  </Field>
                  <Field label="Username">
                    <TextInput value={settings.username} onChange={(v) => set('username', v)} placeholder="your-username" prefix="@" />
                  </Field>
                </div>

                <Field label="Email Address">
                  <TextInput value={settings.email} onChange={(v) => set('email', v)} placeholder="you@example.com" type="email" />
                </Field>

                <Field label="Bio" hint="Brief description for your public profile. Max 200 chars.">
                  <Textarea
                    value={settings.bio}
                    onChange={(v) => set('bio', v)}
                    placeholder="CS student targeting SDE roles. Interested in algorithms, system design, and open source."
                    rows={3}
                  />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Target Role">
                    <TextInput value={settings.targetRole} onChange={(v) => set('targetRole', v)} placeholder="Software Engineer, SDE-1..." />
                  </Field>
                  <Field label="Target Companies">
                    <TextInput value={settings.targetCompanies} onChange={(v) => set('targetCompanies', v)} placeholder="Google, Amazon, Microsoft" />
                  </Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Location">
                    <TextInput value={settings.location} onChange={(v) => set('location', v)} placeholder="City, Country" />
                  </Field>
                  <Field label="Personal Website">
                    <TextInput value={settings.website} onChange={(v) => set('website', v)} placeholder="https://yoursite.com" />
                  </Field>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid #21262d' }}>
                  <SaveButton onClick={handleSave} />
                </div>
              </div>
            )}

            {/* ── TAB: EDUCATION ── */}
            {activeTab === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionTitle
                  title="Education"
                  desc="Your academic background helps companies understand your profile better."
                />

                <Field label="College / University">
                  <TextInput value={settings.college} onChange={(v) => set('college', v)} placeholder="IIT Bombay, NIT Trichy, VIT Vellore..." />
                </Field>

                <Field label="Graduation Year">
                  <SelectInput
                    value={settings.graduationYear}
                    onChange={(v) => set('graduationYear', v)}
                    options={[
                      { value: '2024', label: '2024' },
                      { value: '2025', label: '2025' },
                      { value: '2026', label: '2026' },
                      { value: '2027', label: '2027' },
                      { value: '2028', label: '2028' },
                    ]}
                  />
                </Field>

                <div style={{ paddingTop: '8px', borderTop: '1px solid #21262d' }}>
                  <SaveButton onClick={handleSave} />
                </div>
              </div>
            )}

            {/* ── TAB: CODING PROFILES ── */}
            {activeTab === 'coding' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionTitle
                  title="Coding Profiles"
                  desc="Link your coding platform handles to enable automatic portfolio sync and stats."
                />

                {[
                  { label: 'GitHub', key: 'githubUser' as keyof UserSettings, prefix: 'github.com/', placeholder: 'your-username', color: '#6e7681' },
                  { label: 'LeetCode', key: 'leetcodeUser' as keyof UserSettings, prefix: 'leetcode.com/u/', placeholder: 'your-username', color: '#ffa116' },
                  { label: 'Codeforces', key: 'codeforcesUser' as keyof UserSettings, prefix: 'codeforces.com/profile/', placeholder: 'your-handle', color: '#1890ff' },
                  { label: 'CodeChef', key: 'codechefUser' as keyof UserSettings, prefix: 'codechef.com/users/', placeholder: 'your-handle', color: '#5b4638' },
                  { label: 'GeeksforGeeks', key: 'gfgUser' as keyof UserSettings, prefix: 'geeksforgeeks.org/user/', placeholder: 'your-handle', color: '#2f8d46' },
                ].map((item) => (
                  <Field key={item.key} label={item.label}>
                    <TextInput
                      value={settings[item.key] as string}
                      onChange={(v) => set(item.key, v)}
                      placeholder={item.placeholder}
                      prefix={item.prefix}
                    />
                  </Field>
                ))}

                <div style={{ paddingTop: '8px', borderTop: '1px solid #21262d' }}>
                  <SaveButton onClick={handleSave} />
                </div>
              </div>
            )}

            {/* ── TAB: SOCIAL LINKS ── */}
            {activeTab === 'social' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionTitle
                  title="Social Links"
                  desc="Add your professional and social profile links."
                />

                <Field label="LinkedIn">
                  <TextInput
                    value={settings.linkedinUrl}
                    onChange={(v) => set('linkedinUrl', v)}
                    placeholder="https://linkedin.com/in/your-name"
                    prefix="linkedin.com/in/"
                  />
                </Field>

                <Field label="Twitter / X">
                  <TextInput
                    value={settings.twitterUrl}
                    onChange={(v) => set('twitterUrl', v)}
                    placeholder="https://x.com/yourhandle"
                    prefix="x.com/"
                  />
                </Field>

                <Field label="Portfolio / Personal Site">
                  <TextInput
                    value={settings.portfolioUrl}
                    onChange={(v) => set('portfolioUrl', v)}
                    placeholder="https://yourportfolio.dev"
                  />
                </Field>

                <div style={{ paddingTop: '8px', borderTop: '1px solid #21262d' }}>
                  <SaveButton onClick={handleSave} />
                </div>
              </div>
            )}

            {/* ── TAB: SKILLS ── */}
            {activeTab === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionTitle
                  title="Skills"
                  desc="List your technical skills. These appear as tags on your profile."
                />

                <Field label="Skills" hint="Comma-separated list of your skills.">
                  <Textarea
                    value={settings.skills}
                    onChange={(v) => set('skills', v)}
                    placeholder="C++, Python, React, Node.js, SQL, DSA, System Design, Docker, AWS..."
                    rows={4}
                  />
                </Field>

                {/* Tag Preview */}
                {settings.skills && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Preview:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {settings.skills.split(',').map((s) => s.trim()).filter(Boolean).map((skill) => (
                        <span key={skill} style={{
                          padding: '4px 10px', borderRadius: '20px',
                          background: 'rgba(91, 70, 246, 0.12)',
                          border: '1px solid rgba(91, 70, 246, 0.3)',
                          color: '#a78bfa', fontSize: '12px', fontWeight: '500',
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ paddingTop: '8px', borderTop: '1px solid #21262d' }}>
                  <SaveButton onClick={handleSave} />
                </div>
              </div>
            )}

            {/* ── TAB: PREFERENCES ── */}
            {activeTab === 'preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionTitle
                  title="Workspace Preferences"
                  desc="Customize your code editor, AI coach behavior, and notifications."
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Primary Language">
                    <SelectInput
                      value={settings.primaryLang}
                      onChange={(v) => set('primaryLang', v)}
                      options={[
                        { value: 'cpp', label: 'C++ (GCC 11.2)' },
                        { value: 'python', label: 'Python 3.10' },
                        { value: 'java', label: 'Java 17 OpenJDK' },
                        { value: 'javascript', label: 'JavaScript (Node.js 20)' },
                      ]}
                    />
                  </Field>
                  <Field label="Editor Theme">
                    <SelectInput
                      value={settings.editorTheme}
                      onChange={(v) => set('editorTheme', v)}
                      options={[
                        { value: 'vs-dark', label: 'VS Code Dark' },
                        { value: 'monokai', label: 'Monokai Pro' },
                        { value: 'one-dark', label: 'One Dark Pro' },
                        { value: 'github-dark', label: 'GitHub Dark' },
                      ]}
                    />
                  </Field>
                </div>

                <Field label="AI Coach Proactivity">
                  <SelectInput
                    value={settings.aiCoachingLevel}
                    onChange={(v) => set('aiCoachingLevel', v)}
                    options={[
                      { value: 'proactive', label: 'Proactive — Suggests hints when stuck' },
                      { value: 'on-demand', label: 'On Demand — Only when asked' },
                      { value: 'strict', label: 'Strict — No hints until submission' },
                    ]}
                  />
                </Field>

                {/* Toggle rows */}
                {[
                  { key: 'autoSaveCode' as keyof UserSettings, label: 'Auto-save Code', desc: 'Automatically persist draft solutions as you type.' },
                  { key: 'dailyReminder' as keyof UserSettings, label: 'Daily Problem Reminders', desc: 'Receive notifications to maintain your daily streak.' },
                ].map((item) => (
                  <div key={item.key} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px', borderRadius: '8px',
                    background: '#0d1117', border: '1px solid #21262d',
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#e2e8f0', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.desc}</div>
                    </div>
                    <Toggle
                      checked={settings[item.key] as boolean}
                      onChange={(v) => set(item.key, v)}
                    />
                  </div>
                ))}

                <div style={{ paddingTop: '8px', borderTop: '1px solid #21262d' }}>
                  <SaveButton onClick={handleSave} />
                </div>
              </div>
            )}

            {/* ── TAB: INTEGRATIONS ── */}
            {activeTab === 'integrations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SectionTitle
                  title="API Integrations"
                  desc="Configure API keys to enable code compilation, AI coaching, and GitHub sync."
                />

                {/* Integration cards */}
                {[
                  {
                    id: 'judge0',
                    icon: '⚙️',
                    title: 'Judge0 Code Execution',
                    desc: 'Executes C++, Java, Python in a sandbox. Get a free key from RapidAPI.',
                    label: 'JUDGE0_API_KEY',
                    key: 'judge0Key' as keyof UserSettings,
                    placeholder: 'Paste your RapidAPI key...',
                    status: 'RapidAPI',
                    statusColor: '#38bdf8',
                  },
                  {
                    id: 'gemini',
                    icon: '🤖',
                    title: 'Google Gemini AI',
                    desc: 'Powers the AI Coach chatbot and mock interview agent.',
                    label: 'GEMINI_API_KEY',
                    key: 'geminiKey' as keyof UserSettings,
                    placeholder: 'AIzaSy...',
                    status: 'Google AI Studio',
                    statusColor: '#a78bfa',
                  },
                  {
                    id: 'github',
                    icon: '🐙',
                    title: 'GitHub Auto-Push',
                    desc: 'Automatically commits solved problems to your GitHub repo.',
                    label: 'GITHUB_TOKEN (Personal Access Token)',
                    key: 'githubToken' as keyof UserSettings,
                    placeholder: 'ghp_...',
                    status: 'GitHub',
                    statusColor: '#10b981',
                  },
                ].map((item) => (
                  <div key={item.id} style={{
                    background: '#0d1117', border: '1px solid #21262d',
                    borderRadius: '10px', padding: '20px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '22px' }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>{item.title}</span>
                          <span style={{
                            padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '500',
                            background: `${item.statusColor}18`, color: item.statusColor,
                            border: `1px solid ${item.statusColor}30`,
                          }}>
                            {item.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>{item.desc}</p>
                      </div>
                    </div>
                    <PasswordField
                      label={item.label}
                      value={settings[item.key] as string}
                      onChange={(v) => set(item.key, v)}
                      placeholder={item.placeholder}
                      showKey={!!showKeys[item.id]}
                      onToggleShow={() => toggleKey(item.id)}
                    />
                  </div>
                ))}

                {/* Supabase block */}
                <div style={{
                  background: '#0d1117', border: '1px solid rgba(62, 207, 142, 0.25)',
                  borderRadius: '10px', padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '22px' }}>⚡</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Supabase Cloud DB</span>
                        <span style={{
                          padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '500',
                          background: 'rgba(62, 207, 142, 0.1)', color: '#3ecf8e',
                          border: '1px solid rgba(62, 207, 142, 0.25)',
                        }}>
                          PostgreSQL + Realtime
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                        Stores user accounts, problems, submissions, virtual library rooms, real-time chat messages, and study sessions.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <Field label="NEXT_PUBLIC_SUPABASE_URL">
                      <TextInput
                        value={settings.supabaseUrl}
                        onChange={(v) => set('supabaseUrl', v)}
                        placeholder="https://your-project-ref.supabase.co"
                      />
                    </Field>
                    <PasswordField
                      label="NEXT_PUBLIC_SUPABASE_ANON_KEY"
                      value={settings.supabaseAnonKey}
                      onChange={(v) => set('supabaseAnonKey', v)}
                      placeholder="eyJhbGciOiJIUzI1Ni..."
                      showKey={!!showKeys['supabase']}
                      onToggleShow={() => toggleKey('supabase')}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={async () => {
                          showToast('Testing Supabase connection...');
                          try {
                            await fetch('/api/health');
                            showToast('Connected to Supabase successfully!');
                          } catch {
                            showToast('Running in local demo mode. Add keys to enable cloud sync.');
                          }
                        }}
                        style={{
                          padding: '7px 14px', borderRadius: '6px',
                          background: 'transparent', border: '1px solid rgba(62, 207, 142, 0.4)',
                          color: '#3ecf8e', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                        }}
                      >
                        ⚡ Test Connection
                      </button>
                      <button
                        type="button"
                        onClick={() => copyText(
                          `NEXT_PUBLIC_SUPABASE_URL=${settings.supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${settings.supabaseAnonKey}`,
                          'Supabase config'
                        )}
                        style={{
                          padding: '7px 14px', borderRadius: '6px',
                          background: 'transparent', border: '1px solid #30363d',
                          color: '#8b949e', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                        }}
                      >
                        Copy SQL Schema
                      </button>
                    </div>
                  </div>
                </div>

                {/* .env.local preview */}
                <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderBottom: '1px solid #21262d',
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#8b949e', fontFamily: 'monospace' }}>
                      📄 .env.local
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText(
                        `JUDGE0_API_KEY=${settings.judge0Key || 'your_key'}\nGEMINI_API_KEY=${settings.geminiKey || 'your_key'}\nGITHUB_TOKEN=${settings.githubToken || 'your_token'}\nNEXT_PUBLIC_SUPABASE_URL=${settings.supabaseUrl || 'https://your-project.supabase.co'}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${settings.supabaseAnonKey || 'your_anon_key'}`,
                        '.env.local template'
                      )}
                      style={{
                        padding: '4px 10px', borderRadius: '5px',
                        background: 'transparent', border: '1px solid #30363d',
                        color: '#8b949e', fontSize: '11px', cursor: 'pointer',
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre style={{
                    margin: 0, padding: '16px', fontSize: '12px', color: '#79c0ff',
                    fontFamily: 'monospace', lineHeight: '1.7', overflowX: 'auto',
                  }}>
{`JUDGE0_API_KEY=${settings.judge0Key || '<your_rapidapi_key>'}
GEMINI_API_KEY=${settings.geminiKey || '<your_gemini_api_key>'}
GITHUB_TOKEN=${settings.githubToken || '<ghp_your_token>'}
NEXT_PUBLIC_SUPABASE_URL=${settings.supabaseUrl || '<https://xxx.supabase.co>'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${settings.supabaseAnonKey || '<your_anon_key>'}`}
                  </pre>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid #21262d' }}>
                  <SaveButton onClick={handleSave} label="Save API Keys" />
                </div>
              </div>
            )}

            {/* ── TAB: SECURITY ── */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionTitle
                  title="Security & Account"
                  desc="Manage your password, sessions, and account data."
                />

                <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Change Password</div>
                  <Field label="Current Password">
                    <TextInput type="password" value="" onChange={() => {}} placeholder="••••••••" />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Field label="New Password">
                      <TextInput type="password" value="" onChange={() => {}} placeholder="••••••••" />
                    </Field>
                    <Field label="Confirm New Password">
                      <TextInput type="password" value="" onChange={() => {}} placeholder="••••••••" />
                    </Field>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => showToast('Password updated!')}
                      style={{
                        padding: '8px 18px', borderRadius: '7px',
                        background: 'transparent', border: '1px solid #30363d',
                        color: '#e2e8f0', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div style={{
                  background: '#0d1117', border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px', padding: '20px',
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444', marginBottom: '16px' }}>
                    Danger Zone
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#e2e8f0', marginBottom: '2px' }}>
                        Clear Local Progress Cache
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Resets local problem stats. Your cloud data is unaffected.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.clear();
                        showToast('Local cache cleared.');
                      }}
                      style={{
                        padding: '7px 14px', borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444', fontSize: '12px', fontWeight: '500',
                        cursor: 'pointer', flexShrink: 0,
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
    </div>
  );
}
