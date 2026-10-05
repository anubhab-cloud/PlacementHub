'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMPANIES } from '@/lib/content';
import { getCompanyReadiness, toggleTargetCompany, getProgressStore } from '@/lib/progress';

export default function CompanyDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetIds, setTargetIds] = useState<string[]>([]);

  useEffect(() => {
    const store = getProgressStore();
    setTargetIds(store.targetCompanyIds);

    const handleUpdate = () => {
      const updated = getProgressStore();
      setTargetIds(updated.targetCompanyIds);
    };
    window.addEventListener('progress_updated', handleUpdate);
    return () => window.removeEventListener('progress_updated', handleUpdate);
  }, []);

  const categories: string[] = ['All', 'Product giants', 'Indian unicorns', 'Service and consultancies', 'Fintech and quant'];

  const filteredCompanies = COMPANIES.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category.toLowerCase().includes(selectedCategory.toLowerCase().replace(' giants', '').replace(' and consultancies', '').replace(' unicorns', ''));
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
      <div className="dashboard-hero-card directory-hero">
        <div className="directory-intro">
          <div className="hero-pill-subhead">COMPANY-SPECIFIC TEST PREP</div>
          <h1 className="hero-title">Target company directory</h1>
          <p className="hero-subtitle">
            Explore 18+ top companies across product, service, unicorn and fintech sectors. Analyse round structures, past interview questions and package details, and measure your readiness score.
          </p>
        </div>

        <div className="directory-stats">
          <div className="hero-stat-box-dark">
            <div className="stat-box-label">Total companies</div>
            <div className="stat-box-value">17 tracked</div>
          </div>

          <div className="hero-stat-box-purple">
            <div className="stat-box-label-light">Target companies</div>
            <div className="stat-box-value-white">{targetIds.length || 4} selected</div>
          </div>

          <div className="hero-stat-box-dark">
            <div className="stat-box-label">Verified PYQs</div>
            <div className="stat-box-value">100+ questions</div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px 0', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="company-search-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search company, tech, package"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="directory-cards" aria-live="polite">
        {filteredCompanies.map((company) => {
          const isTarget = targetIds.includes(company.id);
          const readiness = getCompanyReadiness(company);
          const initialLetter = company.name.charAt(0).toUpperCase();

          return (
            <div key={company.id} className="company-dir-card">
              <div>
                {/* Header with Initial Icon & Target Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="company-initial-avatar">
                      {initialLetter}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>{company.name}</h3>
                      <span style={{ fontSize: '11px', color: '#9c9ab8' }}>{company.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggleTarget(company.id, e)}
                    className={`company-target-badge ${isTarget ? 'active' : ''}`}
                  >
                    {isTarget ? 'Target' : '+ Target'}
                  </button>
                </div>

                {/* Key Specs Pills */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span className="company-spec-pill">
                    {company.avgPackage}
                  </span>
                  <span className="company-spec-pill">
                    {company.difficulty}
                  </span>
                  <span className="company-spec-pill">
                    {company.pastQuestionsCount}+ PYQs
                  </span>
                </div>

                {/* Overview Snippet */}
                <p style={{ fontSize: '12px', color: '#9c9ab8', lineHeight: '1.5', marginBottom: '16px', minHeight: '54px' }}>
                  {company.overview}
                </p>

                {/* Readiness Score */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#9c9ab8' }}>
                    <span>Readiness score</span>
                    <span style={{ color: '#ffffff', fontWeight: '700' }}>{readiness}%</span>
                  </div>
                  <div className="readiness-track">
                    <div
                      className="readiness-fill"
                      style={{ width: `${readiness}%` }}
                    />
                  </div>
                </div>

                {/* Focus Topics */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#9c9ab8', fontWeight: '600', marginBottom: '8px' }}>Key focus areas</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {company.focusTopics.map((topic, idx) => (
                      <span key={idx} className="focus-topic-chip">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link href={`/companies/${company.id}`} className="company-cta-button">
                Open {company.name} prep kit →
              </Link>
            </div>
          );
        })}
        {filteredCompanies.length === 0 && <div className="directory-empty">No companies match your search.</div>}
      </div>
    </div>
  );
}

