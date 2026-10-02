import React from 'react';
import { useNeptuneStore, AppView } from '../../store/useNeptuneStore.js';
import { Mic, FolderKanban, Landmark } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentView, setView, dossiers } = useNeptuneStore();

  const overdueCount = dossiers.filter(d => d.statutoryClock.isOverdue).length;

  const items: Array<{ id: AppView; label: string; icon: React.ReactNode; badge?: number | string }> = [
    { id: 'intake', label: 'Draft RTI', icon: <Mic size={18} /> },
    {
      id: 'dossiers',
      label: 'My Cases',
      icon: <FolderKanban size={18} />,
      badge: overdueCount > 0 ? `${overdueCount}` : undefined,
    },
    { id: 'cadastre', label: 'Directory', icon: <Landmark size={18} /> },
  ];

  return (
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {items.map((item) => {
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
                padding: '0.55rem 0.2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                fontSize: '0.72rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: '25%',
                    background: 'var(--neptune-crimson)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 14,
                    height: 14,
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-bottom-nav { display: block !important; }
        }
      `}</style>
    </nav>
  );
};
