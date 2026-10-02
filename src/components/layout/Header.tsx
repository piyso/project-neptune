import React from 'react';
import { useNeptuneStore, IndicLanguage } from '../../store/useNeptuneStore.js';
import { Shield, Sun, Moon, Search, Settings, HelpCircle, User, Scale } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    userMode,
    setUserMode,
    theme,
    toggleTheme,
    language,
    setLanguage,
    setOmnibarOpen,
    setSettingsOpen,
    setHelpOpen,
    backendStatus,
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
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--neptune-emerald)',
            boxShadow: 'var(--neptune-shadow-sm)',
          }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #f8fafc 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: theme === 'sunlight' ? '#000' : 'transparent',
              }}>
                PROJECT NEPTUNE
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--neptune-text-tertiary)', fontWeight: 500 }}>
              Sovereign RTI Copilot • भारत का आरटीआई सहायक
            </div>
          </div>
        </div>

        {/* Global Controls & Diagnostics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* View Mode Switcher: Citizen (Simple) vs Advocate (Pro) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--neptune-bg-elevated)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            padding: 2,
          }}>
            <button
              onClick={() => setUserMode('CITIZEN')}
              title="Citizen Mode: Clean, simple, easy-to-read view for everyday citizens"
              style={{
                border: 'none',
                background: userMode === 'CITIZEN' ? 'var(--neptune-emerald)' : 'transparent',
                color: userMode === 'CITIZEN' ? '#000' : 'var(--neptune-text-secondary)',
                borderRadius: 8,
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.78rem',
                fontWeight: 700,
                transition: 'var(--neptune-transition)',
              }}
            >
              <User size={13} />
              <span>Citizen View</span>
            </button>
            <button
              onClick={() => setUserMode('ADVOCATE')}
              title="Advocate Mode: Deep 3-pane litigation suite with legal telemetry and CPIO radar"
              style={{
                border: 'none',
                background: userMode === 'ADVOCATE' ? 'var(--neptune-cobalt)' : 'transparent',
                color: userMode === 'ADVOCATE' ? '#fff' : 'var(--neptune-text-secondary)',
                borderRadius: 8,
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.78rem',
                fontWeight: 700,
                transition: 'var(--neptune-transition)',
              }}
            >
              <Scale size={13} />
              <span>Advocate Pro</span>
            </button>
          </div>

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
            <HelpCircle size={14} style={{ color: 'var(--neptune-emerald-light)' }} />
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

          {/* High-Contrast Sunlight Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            title={theme === 'dark' ? 'Switch to Sunlight Mode (>100,000 lux outdoor sunlight use)' : 'Switch to Dark Mode'}
            style={{ padding: '0.4rem 0.6rem' }}
          >
            {theme === 'dark' ? <Sun size={15} style={{ color: '#fbbf24' }} /> : <Moon size={15} />}
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

