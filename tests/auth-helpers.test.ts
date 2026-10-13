import { describe, it, expect } from 'vitest';

// Test formatting and initials extraction algorithms established in AuthContext
function formatNameFromEmail(email: string): string {
  if (!email) return 'Student';
  const prefix = email.split('@')[0] || 'Student';
  const parts = prefix.split(/[._\-+]+/).filter(Boolean);
  if (parts.length === 0) return 'Student';
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'ST';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

describe('Auth Utility Functions', () => {
  it('correctly extracts formatted names from varied email patterns', () => {
    expect(formatNameFromEmail('rohit.kumar@gmail.com')).toBe('Rohit Kumar');
    expect(formatNameFromEmail('priya_sharma@university.edu')).toBe('Priya Sharma');
    expect(formatNameFromEmail('alex@nexusprep.io')).toBe('Alex');
    expect(formatNameFromEmail('jane-doe+test@gmail.com')).toBe('Jane Doe Test');
    expect(formatNameFromEmail('')).toBe('Student');
  });

  it('correctly generates initials for single and multi-word names', () => {
    expect(getInitials('Rohit Kumar')).toBe('RK');
    expect(getInitials('Alex')).toBe('AL');
    expect(getInitials('Dr. Jane Doe')).toBe('DD');
    expect(getInitials('')).toBe('ST');
  });
});
