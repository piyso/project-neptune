import React from 'react';
import { useNeptuneStore, SurfaceMode, IndicLanguage } from '../../store/useNeptuneStore.js';
import { Shield, Sun, Moon, Search, Laptop, Smartphone, Monitor, Radio, CheckCircle2, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    surfaceMode,
    setSurfaceMode,
    theme,
    toggleTheme,
    language,
    setLanguage,
    setOmnibarOpen,
    setSettingsOpen,
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
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
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
                fontSize: '1.05rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #f8fafc 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: theme === 'sunlight' ? '#000' : 'transparent',
              }}>
                PROJECT NEPTUNE
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                PROD v1.0
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)', fontWeight: 500 }}>
              Sovereign Civic Intelligence & Statutory RTI Copilot
            </div>
          </div>
        </div>

        {/* Global Controls & Diagnostics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Engine Status Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.65rem',
            background: 'var(--neptune-bg-elevated)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 8,
            fontSize: '0.75rem',
            color: 'var(--neptune-text-secondary)',
          }} title="Backend Decoupled Architecture: Standalone local execution with seamless live gateway failover">
            <span className={`status-dot ${backendStatus === 'LIVE_CONNECTED' ? 'emerald' : 'amber'}`} />
            <span style={{ fontWeight: 600 }}>
              {backendStatus === 'LIVE_CONNECTED' ? 'Live Gateway Synced' : 'Standalone Local Kernel'}
            </span>
          </div>

          {/* Quick Omnibar search trigger */}
          <button
            onClick={() => setOmnibarOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
          >
            <Search size={14} />
            <span style={{ display: 'inline-block' }}>Search / Cmd+K</span>
          </button>

          {/* Surface Mode Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--neptune-bg-elevated)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 8,
            padding: 2,
          }}>
            <button
              onClick={() => setSurfaceMode('DESKTOP_LITIGATION')}
              title="Desktop Litigation Suite (1280px+ 3-Pane)"
              style={{
                border: 'none',
                background: surfaceMode === 'DESKTOP_LITIGATION' ? 'var(--neptune-emerald)' : 'transparent',
                color: surfaceMode === 'DESKTOP_LITIGATION' ? '#fff' : 'var(--neptune-text-secondary)',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <Laptop size={13} />
              <span>Litigation</span>
            </button>
            <button
              onClick={() => setSurfaceMode('MOBILE_PWA')}
              title="Mobile PWA Simulation (Thumb-Zone Ergonomics)"
              style={{
                border: 'none',
                background: surfaceMode === 'MOBILE_PWA' ? 'var(--neptune-emerald)' : 'transparent',
                color: surfaceMode === 'MOBILE_PWA' ? '#fff' : 'var(--neptune-text-secondary)',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <Smartphone size={13} />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setSurfaceMode('CSC_KIOSK')}
              title="CSC Village Assisted Touch Kiosk"
              style={{
                border: 'none',
                background: surfaceMode === 'CSC_KIOSK' ? 'var(--neptune-emerald)' : 'transparent',
                color: surfaceMode === 'CSC_KIOSK' ? '#fff' : 'var(--neptune-text-secondary)',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <Monitor size={13} />
              <span>CSC Kiosk</span>
            </button>
          </div>

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
            title={theme === 'dark' ? 'Switch to Sunlight Mode (>100,000 lux outdoor village use)' : 'Switch to Obsidian Dark Mode'}
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
