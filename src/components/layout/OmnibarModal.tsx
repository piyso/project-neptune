import React, { useState, useEffect } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { Search, Mic, FolderKanban, Shield, Scale, Sun, Moon, ArrowRight, X } from 'lucide-react';

export const OmnibarModal: React.FC = () => {
  const { isOmnibarOpen, setOmnibarOpen, setView, dossiers, selectDossier, toggleTheme, theme } = useNeptuneStore();
  const [query, setQuery] = useState('');

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOmnibarOpen(!isOmnibarOpen);
      }
      if (e.key === 'Escape' && isOmnibarOpen) {
        setOmnibarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOmnibarOpen, setOmnibarOpen]);

  if (!isOmnibarOpen) return null;

  const actions = [
    {
      id: 'act-voice',
      label: 'Dictate New Grievance (16kHz Live Indic Worklet)',
      category: 'Intake',
      icon: <Mic size={16} className="text-emerald" />,
      run: () => { setView('intake'); setOmnibarOpen(false); },
    },
    {
      id: 'act-theme',
      label: `Switch Theme to ${theme === 'dark' ? 'Sunlight Mode (>100k lux outdoor)' : 'Obsidian Dark Mode'}`,
      category: 'Display',
      icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
      run: () => { toggleTheme(); setOmnibarOpen(false); },
    },
    {
      id: 'act-kiosk',
      label: 'Open Rural CSC Assisted Kiosk Mode (48px Touch POS)',
      category: 'Surface',
      icon: <Scale size={16} />,
      run: () => { setView('kiosk'); setOmnibarOpen(false); },
    },
    {
      id: 'act-vault',
      label: 'View Section 63 BSA Cryptographic Evidence Vault',
      category: 'Legal Evidence',
      icon: <Shield size={16} />,
      run: () => { setView('vault'); setOmnibarOpen(false); },
    },
  ];

  const matchedDossiers = dossiers.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    (d.govRegistrationNumber && d.govRegistrationNumber.toLowerCase().includes(query.toLowerCase())) ||
    d.targetAuthority.canonicalName.toLowerCase().includes(query.toLowerCase())
  );

  const matchedActions = actions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={() => setOmnibarOpen(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: 580, padding: '1rem', background: 'var(--neptune-bg-card)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid var(--neptune-border-card)',
          paddingBottom: '0.75rem',
          marginBottom: '0.75rem',
        }}>
          <Search size={18} style={{ color: 'var(--neptune-emerald)' }} />
          <input
            type="text"
            autoFocus
            placeholder="Type a case, authority, or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--neptune-text-primary)',
              fontSize: '1rem',
              width: '100%',
              fontFamily: 'var(--neptune-font-sans)',
            }}
          />
          <button
            onClick={() => setOmnibarOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--neptune-text-tertiary)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results list */}
        <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {/* Quick Actions */}
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700, padding: '0.2rem 0.5rem' }}>
            Suggested Actions
          </div>
          {matchedActions.map((action) => (
            <div
              key={action.id}
              onClick={action.run}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.75rem',
                borderRadius: 8,
                background: 'var(--neptune-bg-elevated)',
                cursor: 'pointer',
                transition: 'var(--neptune-transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--neptune-bg-card-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--neptune-bg-elevated)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {action.icon}
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{action.label}</span>
              </div>
              <ArrowRight size={14} style={{ color: 'var(--neptune-text-tertiary)' }} />
            </div>
          ))}

          {/* Dossiers */}
          {matchedDossiers.length > 0 && (
            <>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700, padding: '0.4rem 0.5rem 0.1rem 0.5rem' }}>
                Matching Dossiers ({matchedDossiers.length})
              </div>
              {matchedDossiers.map((d) => (
                <div
                  key={d.dossierId}
                  onClick={() => { selectDossier(d.dossierId); setOmnibarOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 8,
                    background: 'var(--neptune-bg-surface)',
                    border: '1px solid var(--neptune-border-card)',
                    cursor: 'pointer',
                    transition: 'var(--neptune-transition)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--neptune-emerald)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--neptune-border-card)')}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{d.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>
                      {d.govRegistrationNumber || d.postalBarcode} • {d.targetAuthority.canonicalName}
                    </div>
                  </div>
                  <span className={`badge ${d.statutoryClock.isOverdue ? 'badge-crimson' : 'badge-emerald'}`}>
                    {d.statutoryClock.daysRemaining}d left
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
