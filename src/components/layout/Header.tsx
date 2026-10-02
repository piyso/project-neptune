import React from 'react';
import { useNeptuneStore, AppView, IndicLanguage } from '../../store/useNeptuneStore.js';
import { Shield, Sun, Moon, Search, Settings, HelpCircle, Mic, FolderKanban, Landmark } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setView,
    dossiers,
    theme,
    toggleTheme,
    language,
    setLanguage,
    setOmnibarOpen,
    setSettingsOpen,
    setHelpOpen,
  } = useNeptuneStore();

  const overdueCount = dossiers.filter(d => d.statutoryClock.isOverdue).length;

  const navItems: Array<{ id: AppView; label: string; icon: React.ReactNode; badge?: number | string }> = [
    { id: 'intake', label: 'Draft RTI', icon: <Mic size={15} /> },
    {
      id: 'dossiers',
      label: 'My Cases',
      icon: <FolderKanban size={15} />,
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : dossiers.length,
    },
    { id: 'cadastre', label: 'Directory', icon: <Landmark size={15} /> },
  ];

  return (
    <header style={{
      background: 'var(--neptune-bg-surface)',
      borderBottom: '1px solid var(--neptune-border-card)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--neptune-shadow-sm)',
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '0 1.5rem',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Left: Brand Identity + Primary Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Logo & Title */}
          <div
            onClick={() => setView('intake')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          >
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
              border: '1px solid var(--neptune-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--neptune-emerald)',
            }}>
              <Shield size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  letterSpacing: '-0.02em',
                  color: 'var(--neptune-text-primary)',
                }}>
                  NEPTUNE
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '0.12rem 0.45rem', fontWeight: 700 }}>
                  RTI 2005
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-header-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  style={{
                    border: 'none',
                    background: isActive ? 'var(--neptune-bg-elevated)' : 'transparent',
                    color: isActive ? 'var(--neptune-emerald)' : 'var(--neptune-text-secondary)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'var(--neptune-transition)',
                  }}
                >
                  <span style={{ color: isActive ? 'var(--neptune-emerald)' : 'var(--neptune-text-tertiary)' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`badge ${typeof item.badge === 'string' && item.badge.includes('Overdue') ? 'badge-crimson' : 'badge-neutral'}`}
                      style={{ fontSize: '0.64rem', padding: '0.1rem 0.38rem', marginLeft: 2 }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Language, Theme, Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Omnibar Search */}
          <button
            onClick={() => setOmnibarOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', padding: '0.38rem 0.75rem' }}
          >
            <Search size={14} style={{ color: 'var(--neptune-text-tertiary)' }} />
            <span style={{ color: 'var(--neptune-text-secondary)' }}>Search (⌘K)</span>
          </button>

          {/* Guide / FAQ */}
          <button
            onClick={() => setHelpOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', padding: '0.38rem 0.65rem' }}
            title="How RTI Works Guide"
          >
            <HelpCircle size={14} style={{ color: 'var(--neptune-emerald)' }} />
            <span>Guide</span>
          </button>

          {/* Indic Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as IndicLanguage)}
            style={{
              background: 'var(--neptune-bg-elevated)',
              border: '1px solid var(--neptune-border-card)',
              color: 'var(--neptune-text-primary)',
              borderRadius: 8,
              padding: '0.35rem 0.6rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="HINDI">🇮🇳 हिन्दी</option>
            <option value="ENGLISH">🇬🇧 English</option>
            <option value="BHOJPURI">🇮🇳 भोजपुरी</option>
            <option value="TAMIL">🇮🇳 தமிழ்</option>
            <option value="BENGALI">🇮🇳 বাংলা</option>
            <option value="MARATHI">🇮🇳 मराठी</option>
          </select>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            title={theme === 'dark' ? 'Switch to Clean Daylight Mode' : 'Switch to Dark Mode'}
            style={{ padding: '0.4rem 0.55rem' }}
          >
            {theme === 'dark' ? <Sun size={15} style={{ color: '#fbbf24' }} /> : <Moon size={15} style={{ color: '#64748b' }} />}
          </button>

          {/* Privacy & Security Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="btn btn-secondary btn-sm"
            title="Privacy & Security Settings"
            style={{ padding: '0.4rem 0.55rem' }}
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-header-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
};
