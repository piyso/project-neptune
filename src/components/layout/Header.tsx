import React from 'react';
import { useNeptuneStore, IndicLanguage } from '../../store/useNeptuneStore.js';
import { Shield, Sun, Moon, Search, Settings, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    setOmnibarOpen,
    setSettingsOpen,
    setHelpOpen,
  } = useNeptuneStore();

  return (
    <header style={{
      background: 'var(--neptune-bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--neptune-border-card)',
      padding: '0.75rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
            border: '1px solid var(--neptune-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--neptune-emerald)',
            boxShadow: 'var(--neptune-shadow-sm)',
          }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                color: 'var(--neptune-text-primary)',
              }}>
                PROJECT NEPTUNE
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', fontWeight: 700 }}>
                RTI Copilot
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--neptune-text-tertiary)', fontWeight: 500 }}>
              भारत का आरटीआई सहायक • Right to Information Act, 2005
            </div>
          </div>
        </div>

        {/* Global Controls & Diagnostics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Quick Omnibar search trigger */}
          <button
            onClick={() => setOmnibarOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
          >
            <Search size={14} />
            <span>Search (⌘K)</span>
          </button>

          {/* Quick How It Works guide trigger */}
          <button
            onClick={() => setHelpOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
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
              padding: '0.35rem 0.65rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="HINDI">🇮🇳 हिन्दी (Hindi)</option>
            <option value="BHOJPURI">🇮🇳 भोजपुरी (Bhojpuri)</option>
            <option value="ENGLISH">🇬🇧 English</option>
            <option value="TAMIL">🇮🇳 தமிழ் (Tamil)</option>
            <option value="BENGALI">🇮🇳 বাংলা (Bengali)</option>
            <option value="MARATHI">🇮🇳 मराठी (Marathi)</option>
          </select>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            title={theme === 'dark' ? 'Switch to Clean Daylight Mode' : 'Switch to Dark Mode'}
            style={{ padding: '0.4rem 0.6rem' }}
          >
            {theme === 'dark' ? <Sun size={15} style={{ color: '#fbbf24' }} /> : <Moon size={15} style={{ color: '#64748b' }} />}
          </button>

          {/* Privacy & Security Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="btn btn-secondary btn-sm"
            title="Privacy, Whistleblower Shield & Security Settings"
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <Settings size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};

