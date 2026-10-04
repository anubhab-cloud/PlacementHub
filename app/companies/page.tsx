'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMPANIES, CompanyCategory, Company } from '@/lib/content';
import { getCompanyReadiness, toggleTargetCompany, getProgressStore } from '@/lib/progress';

export default function CompanyDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetIds, setTargetIds] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const store = getProgressStore();
    setTargetIds(store.targetCompanyIds);

    const handleUpdate = () => {
      const updated = getProgressStore();
      setTargetIds(updated.targetCompanyIds);
      setRefreshTrigger((prev) => prev + 1);
    };
    window.addEventListener('progress_updated', handleUpdate);
    return () => window.removeEventListener('progress_updated', handleUpdate);
  }, []);

  const categories: string[] = ['All', 'Product Giants', 'Indian Unicorns', 'Service & Consultancies', 'Fintech & Quant'];

  const filteredCompanies = COMPANIES.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.focusTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.avgPackage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggleTarget = (cId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTargetCompany(cId);
    setTargetIds((prev) =>
      prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId]
    );
  };

  return (
    <div className="dashboard-container">
      {/* Hero Header */}
      <div className="dashboard-hero-card">
        <div className="hero-content-group">
          <div className="hero-pill-tag">
            <span className="live-sync-dot" /> Company-Specific Test Prep
          </div>
          <h1 className="hero-title">Target Company Directory</h1>
          <p className="hero-subtitle">
            Explore 18+ top companies across Product, Service, Unicorn, and Fintech sectors. 
            Analyze round structures, past interview questions, package details, and measure your exact readiness score.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div className="dashboard-widget-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '24px' }}>🏢</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Total Companies</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)' }}>{COMPANIES.length} Tracked</div>
              </div>
            </div>

            <div className="dashboard-widget-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '24px' }}>⭐</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Target Companies</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>{targetIds.length} Selected</div>
              </div>
            </div>

            <div className="dashboard-widget-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '24px' }}>❓</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Verified PYQs</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--green)' }}>100+ Interview Qs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px 0', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-violet' : 'btn-ghost'}`}
              style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="topbar-search-pill" style={{ width: '280px', margin: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search company, tech, package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredCompanies.map((company) => {
          const isTarget = targetIds.includes(company.id);
          const readiness = getCompanyReadiness(company);

          return (
            <div key={company.id} className="dashboard-widget-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                {/* Header with Pin Target button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {company.logo}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)' }}>{company.name}</h3>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{company.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggleTarget(company.id, e)}
                    style={{
                      background: isTarget ? 'rgba(99, 91, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isTarget ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
                      color: isTarget ? 'var(--accent)' : 'var(--text-3)',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isTarget ? '★ Target' : '+ Target'}
                  </button>
                </div>

                {/* Key Specs Pill */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(62, 207, 142, 0.1)', color: 'var(--green)', borderRadius: '4px', fontWeight: '600' }}>
                    💰 {company.avgPackage}
                  </span>
                  <span className={`pill-${company.difficulty.toLowerCase().split('-')[0]}`} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                    ⚡ {company.difficulty}
                  </span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)', borderRadius: '4px' }}>
                    ❓ {company.pastQuestionsCount}+ PYQs
                  </span>
                </div>

                {/* Overview Snippet */}
                <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5', marginBottom: '16px' }}>
                  {company.overview}
                </p>

                {/* Readiness Meter */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'var(--text-3)' }}>
                    <span>Readiness Score</span>
                    <span style={{ color: 'var(--text-1)', fontWeight: '700' }}>{readiness}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${readiness}%`,
                      height: '100%',
                      background: readiness > 70 ? 'var(--green)' : readiness > 40 ? 'var(--accent)' : 'var(--amber)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                {/* Focus Topics */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: '600', marginBottom: '6px' }}>Key Focus Areas:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {company.focusTopics.map((topic, idx) => (
                      <span key={idx} style={{ fontSize: '11px', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', color: 'var(--text-2)' }}>
                        • {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link href={`/companies/${company.id}`} className="btn btn-violet" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                Open {company.name} Prep Kit →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
