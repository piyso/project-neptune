import React from 'react';
import { useNeptuneStore, AppView } from '../../store/useNeptuneStore.js';
import { Mic, FolderKanban, Landmark, KeySquare, Monitor, Clock } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentView, setView, dossiers } = useNeptuneStore();

  const overdueCount = dossiers.filter(d => d.statutoryClock.isOverdue).length;

  const navItems: Array<{ id: AppView; label: string; subLabel: string; icon: React.ReactNode; badge?: number | string }> = [
    { id: 'intake', label: 'Draft RTI', subLabel: 'शिकायत दर्ज करें', icon: <Mic size={17} /> },
    { id: 'dossiers', label: 'Track Cases', subLabel: 'समय सीमा व स्थिति', icon: <FolderKanban size={17} />, badge: overdueCount > 0 ? `${overdueCount} Overdue` : dossiers.length },
    { id: 'cadastre', label: 'Govt Directory', subLabel: 'सरकारी विभाग', icon: <Landmark size={17} /> },
    { id: 'vault', label: 'Legal Proof Vault', subLabel: 'सबूत व सर्टिफिकेट', icon: <KeySquare size={17} /> },
    { id: 'kiosk', label: 'Simple Touch Kiosk', subLabel: 'आसान मोड', icon: <Monitor size={17} /> },
  ];

  return (
    <>
      {/* Desktop / Tablet Nav Bar */}
      <nav style={{
        background: 'var(--neptune-bg-surface)',
        borderBottom: '1px solid var(--neptune-border-card)',
        padding: '0.25rem 1.5rem',
      }} className="desktop-nav-container">
        <div style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
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
                  padding: '0.6rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'var(--neptune-transition)',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.icon}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <span style={{ lineHeight: 1.2 }}>{item.label}</span>
                  <span style={{ fontSize: '0.68rem', color: isActive ? 'var(--neptune-emerald)' : 'var(--neptune-text-tertiary)', fontWeight: 500 }}>
                    {item.subLabel}
                  </span>
                </div>
                {item.badge && (
                  <span className={`badge ${typeof item.badge === 'string' && item.badge.includes('Overdue') ? 'badge-crimson' : 'badge-neutral'}`} style={{ fontSize: '0.7rem', marginLeft: 4 }}>
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
