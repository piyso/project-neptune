import React from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { Shield, Lock, FileText, Scale, Landmark, Monitor, HelpCircle, Settings, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView, setHelpOpen, setSettingsOpen, setKanbanView } = useNeptuneStore();

  return (
    <footer style={{
      background: 'var(--neptune-bg-surface)',
      borderTop: '1px solid var(--neptune-border-card)',
      padding: '2.5rem 1.5rem 1.5rem 1.5rem',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
        }}>
          {/* Brand & Statutory Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'var(--neptune-badge-emerald-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--neptune-emerald)',
              }}>
                <Shield size={16} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--neptune-text-primary)' }}>
                PROJECT NEPTUNE
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
                Civic Utility
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--neptune-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Empowering Indian citizens to enforce constitutional transparency. Automatic Section 2(f) record drafting, 30-day statutory countdown enforcement, and court-admissible Section 63 BSA evidence seals.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--neptune-emerald)', fontWeight: 600 }}>
              <CheckCircle2 size={14} />
              <span>100% Client-Side Privacy • DPDP 2023 Protected</span>
            </div>
          </div>

          {/* Quick Links: Core Missions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--neptune-text-primary)' }}>
              Core Civic Services
            </div>
            <button
              onClick={() => setView('intake')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--neptune-text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              📝 Draft New RTI Application
            </button>
            <button
              onClick={() => setView('dossiers')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--neptune-text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              📁 Track Cases & 30-Day Deadlines
            </button>
            <button
              onClick={() => setView('cadastre')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--neptune-text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              🏛️ 2,800+ Ministry & CPIO Directory
            </button>
          </div>

          {/* Sovereign Utilities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--neptune-text-primary)' }}>
              Sovereign Legal Tools
            </div>
            <button
              onClick={() => setView('vault')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--neptune-text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              🛡️ Section 63 BSA Digital Evidence Vault
            </button>
            <button
              onClick={() => setView('kiosk')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--neptune-text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              🖥️ CSC Rural Assisted Kiosk Mode
            </button>
            <button
              onClick={() => { setView('dossiers'); setKanbanView(true); }}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--neptune-text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              📊 Multi-Case Statutory Kanban Board
            </button>
          </div>

          {/* Assistance & Privacy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--neptune-text-primary)' }}>
              Assistance & Privacy
            </div>
            <button
              onClick={() => setHelpOpen(true)}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--neptune-text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              📖 How RTI Works (Citizen FAQ)
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--neptune-text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              ⚙️ Privacy & Security Settings
            </button>
            <div style={{ fontSize: '0.76rem', color: 'var(--neptune-text-tertiary)', marginTop: 4 }}>
              Statutory Jurisdiction: Republic of India • RTI Act 2005 (Act 22 of 2005)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--neptune-border-card)',
          fontSize: '0.76rem',
          color: 'var(--neptune-text-tertiary)',
        }}>
          <div>
            Project Neptune • Sovereign Civic Intelligence • Free & Open Civic Software
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>NTP Real-Time Sync</span>
            <span>•</span>
            <span>Local SQLite/IndexedDB Storage</span>
            <span>•</span>
            <span style={{ color: 'var(--neptune-emerald)', fontWeight: 600 }}>Active Kernel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
