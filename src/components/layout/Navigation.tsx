import React from 'react';
import { useNeptuneStore, AppView } from '../../store/useNeptuneStore.js';
import { Mic, FolderKanban, Landmark, KeySquare, Monitor, Clock } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentView, setView, dossiers } = useNeptuneStore();

  const overdueCount = dossiers.filter(d => d.statutoryClock.isOverdue).length;

  const navItems: Array<{ id: AppView; label: string; icon: React.ReactNode; badge?: number | string }> = [
    { id: 'intake', label: 'Draft RTI', icon: <Mic size={16} /> },
    { id: 'dossiers', label: 'Track Cases', icon: <FolderKanban size={16} />, badge: overdueCount > 0 ? `${overdueCount} Overdue` : dossiers.length },
    { id: 'cadastre', label: 'Govt Directory', icon: <Landmark size={16} /> },
    { id: 'vault', label: 'Evidence Vault', icon: <KeySquare size={16} /> },
    { id: 'kiosk', label: 'Kiosk Mode', icon: <Monitor size={16} /> },
  ];

  return (
    <>
      {/* Desktop / Tablet Nav Bar */}
      <nav style={{
        background: 'var(--neptune-bg-surface)',
        borderBottom: '1px solid var(--neptune-border-card)',
        padding: '0 1.5rem',
      }} className="desktop-nav-container">
        <div style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          overflowX: 'auto',
        }}>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={{
                  border: 'none',
                  background: isActive ? 'var(--neptune-bg-card)' : 'transparent',
                  color: isActive ? 'var(--neptune-emerald-light)' : 'var(--neptune-text-secondary)',
                  borderBottom: isActive ? '2px solid var(--neptune-emerald)' : '2px solid transparent',
                  padding: '0.65rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'var(--neptune-transition)',
                  whiteSpace: 'nowrap',
                  borderRadius: '6px 6px 0 0',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`badge ${typeof item.badge === 'string' && item.badge.includes('Overdue') ? 'badge-crimson' : 'badge-neutral'}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', marginLeft: 4 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Fixed Bottom Thumb-Zone Navigation */}
      <nav className="mobile-bottom-nav" style={{
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
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={{
                  border: 'none',
                  background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                  color: isActive ? 'var(--neptune-emerald-light)' : 'var(--neptune-text-secondary)',
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
