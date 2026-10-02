import React from 'react';
import { useNeptuneStore, AppView } from '../../store/useNeptuneStore.js';
import { Mic, FolderKanban, Landmark, ShieldCheck, Monitor } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentView, setView, dossiers } = useNeptuneStore();

  const overdueCount = dossiers.filter(d => d.statutoryClock.isOverdue).length;

  const primaryItems: Array<{ id: AppView; label: string; icon: React.ReactNode; badge?: number | string }> = [
    { id: 'intake', label: 'Draft RTI', icon: <Mic size={16} /> },
    {
      id: 'dossiers',
      label: 'Track Cases',
      icon: <FolderKanban size={16} />,
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : dossiers.length,
    },
    { id: 'cadastre', label: 'Govt Directory', icon: <Landmark size={16} /> },
  ];

  const utilityItems: Array<{ id: AppView; label: string; icon: React.ReactNode }> = [
    { id: 'vault', label: 'Legal Proof Vault (BSA)', icon: <ShieldCheck size={15} /> },
    { id: 'kiosk', label: 'CSC Kiosk Mode', icon: <Monitor size={15} /> },
  ];

  return (
    <>
      {/* Desktop / Tablet Nav Bar */}
      <nav
        style={{
          background: 'var(--neptune-bg-surface)',
          borderBottom: '1px solid var(--neptune-border-card)',
          padding: '0 1.5rem',
        }}
        className="desktop-nav-container"
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Primary Core Mission Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {primaryItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  style={{
                    border: 'none',
                    background: isActive ? 'var(--neptune-bg-card)' : 'transparent',
                    color: isActive ? 'var(--neptune-emerald)' : 'var(--neptune-text-secondary)',
                    borderBottom: isActive ? '2px solid var(--neptune-emerald)' : '2px solid transparent',
                    padding: '0.75rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'var(--neptune-transition)',
                    whiteSpace: 'nowrap',
                    borderRadius: '8px 8px 0 0',
                  }}
                >
                  <span style={{ color: isActive ? 'var(--neptune-emerald)' : 'var(--neptune-text-tertiary)' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`badge ${typeof item.badge === 'string' && item.badge.includes('Overdue') ? 'badge-crimson' : 'badge-neutral'}`}
                      style={{ fontSize: '0.68rem', padding: '0.12rem 0.45rem', marginLeft: 4 }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Utilities (Vault & Kiosk) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {utilityItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  style={{
                    border: '1px solid',
                    borderColor: isActive ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)',
                    background: isActive ? 'var(--neptune-badge-emerald-bg)' : 'transparent',
                    color: isActive ? 'var(--neptune-emerald)' : 'var(--neptune-text-tertiary)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.76rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'var(--neptune-transition)',
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Thumb-Zone Navigation */}
      <nav
        className="mobile-bottom-nav"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--neptune-bg-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--neptune-border-card)',
          zIndex: 100,
          padding: '0.35rem 0.5rem',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {[...primaryItems, utilityItems[0]].map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={{
                  border: 'none',
                  background: isActive ? 'var(--neptune-badge-emerald-bg)' : 'transparent',
                  color: isActive ? 'var(--neptune-emerald)' : 'var(--neptune-text-secondary)',
                  borderRadius: 8,
                  padding: '0.5rem 0.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  fontSize: '0.68rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-container { display: none !important; }
          .mobile-bottom-nav { display: block !important; }
        }
      `}</style>
    </>
  );
};
