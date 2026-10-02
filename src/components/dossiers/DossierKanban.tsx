import React, { useState } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { ICitizenRTIDossier, StatutoryStage } from '../../types/dossier.js';
import { Search, Filter, Clock, AlertTriangle, ShieldCheck, ArrowRight, Scale, CheckCircle2 } from 'lucide-react';

interface StageColumnConfig {
  id: StatutoryStage;
  title: string;
  color: string;
  badgeBg: string;
}

const KANBAN_STAGES: StageColumnConfig[] = [
  { id: 'PENDING_CPIO', title: 'CPIO Review (0-30d)', color: 'var(--neptune-emerald)', badgeBg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'SEC6_3_HOP', title: 'Sec 6(3) Transfer (+5d)', color: 'var(--neptune-amber)', badgeBg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'FEE_PAUSED', title: 'Sec 7(3) Fee Paused', color: 'var(--neptune-amber)', badgeBg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'DEEMED_REFUSAL', title: 'Deemed Refusal (Day 31+)', color: 'var(--neptune-crimson)', badgeBg: 'rgba(239, 68, 68, 0.15)' },
  { id: 'FIRST_APPEAL_PENDING', title: '1st Appeal (FAA)', color: 'var(--neptune-cobalt)', badgeBg: 'rgba(59, 130, 246, 0.15)' },
  { id: 'CIC_SECOND_APPEAL', title: '2nd Appeal (CIC)', color: '#8b5cf6', badgeBg: 'rgba(139, 92, 246, 0.15)' },
];

export const DossierKanban: React.FC = () => {
  const { dossiers, selectDossier } = useNeptuneStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'SAFE' | 'AMBER' | 'BREACHED'>('ALL');

  const filteredDossiers = dossiers.filter((d) => {
    const regNum = d.govRegistrationNumber || d.postalBarcode || '';
    const matchesSearch =
      d.targetAuthority.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.queryBlocks.some(q => q.certifiedQueryText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      regNum.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const days = d.statutoryClock.daysRemaining;
    const stage = d.statutoryClock.stage;

    if (filterRisk === 'BREACHED') return days <= 0 || stage === 'DEEMED_REFUSAL';
    if (filterRisk === 'AMBER') return days <= 10 && days > 0;
    if (filterRisk === 'SAFE') return days > 10;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      {/* Top Filter Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--neptune-bg-card)',
        padding: '0.8rem 1.2rem',
        borderRadius: 14,
        border: '1px solid var(--neptune-border-subtle)',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 460 }}>
          <Search size={16} color="var(--neptune-text-secondary)" />
          <input
            type="text"
            placeholder="Filter active filings by ministry, tender ref, or registration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--neptune-text-primary)',
              fontSize: '0.84rem',
              width: '100%',
            }}
          />
        </div>

        {/* Risk Pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['ALL', 'SAFE', 'AMBER', 'BREACHED'] as const).map((risk) => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              style={{
                background: filterRisk === risk ? 'var(--neptune-bg-elevated)' : 'transparent',
                border: filterRisk === risk ? '1px solid var(--neptune-border-active)' : '1px solid var(--neptune-border-subtle)',
                color: filterRisk === risk ? 'var(--neptune-emerald-light)' : 'var(--neptune-text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: 20,
                cursor: 'pointer',
              }}
            >
              {risk === 'ALL' && 'All Cases'}
              {risk === 'SAFE' && '🟢 Safe (>10d)'}
              {risk === 'AMBER' && '🟡 Warning (≤10d)'}
              {risk === 'BREACHED' && '🔴 Overdue / Breached'}
            </button>
          ))}
        </div>
      </div>

      {/* 6-Column Kanban Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(260px, 1fr))',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        alignItems: 'start',
      }}>
        {KANBAN_STAGES.map((col) => {
          const colDossiers = filteredDossiers.filter((d) => d.statutoryClock.stage === col.id);

          return (
            <div
              key={col.id}
              style={{
                background: 'var(--neptune-bg-card)',
                border: '1px solid var(--neptune-border-subtle)',
                borderRadius: 14,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '75vh',
                boxShadow: 'var(--neptune-shadow-card)',
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '0.8rem 1rem',
                borderBottom: '1px solid var(--neptune-border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: col.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{col.title}</span>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  fontFamily: 'var(--neptune-font-mono)',
                  background: col.badgeBg,
                  color: col.color,
                  padding: '1px 6px',
                  borderRadius: 10,
                }}>
                  {colDossiers.length}
                </span>
              </div>

              {/* Cards List */}
              <div style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
                {colDossiers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: 'var(--neptune-text-secondary)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                    No filings in this stage
                  </div>
                ) : (
                  colDossiers.map((dossier) => {
                    const isOverdue = dossier.statutoryClock.daysRemaining <= 0;
                    const regNum = dossier.govRegistrationNumber || dossier.postalBarcode || dossier.dossierId.substring(0, 12);

                    return (
                      <div
                        key={dossier.dossierId}
                        onClick={() => selectDossier(dossier.dossierId)}
                        style={{
                          background: 'var(--neptune-bg-elevated)',
                          border: isOverdue ? '1px solid var(--neptune-crimson)' : '1px solid var(--neptune-border-subtle)',
                          borderRadius: 10,
                          padding: '0.8rem',
                          cursor: 'pointer',
                          transition: 'var(--neptune-transition-fast)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--neptune-font-mono)', color: 'var(--neptune-emerald-light)' }}>
                            {regNum}
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: 4,
                            background: isOverdue ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: isOverdue ? 'var(--neptune-crimson)' : 'var(--neptune-emerald)',
                          }}>
                            {isOverdue ? 'EXPIRED' : `${dossier.statutoryClock.daysRemaining}d left`}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neptune-text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
                          {dossier.targetAuthority.canonicalName}
                        </div>

                        <p style={{
                          margin: '0 0 8px',
                          fontSize: '0.72rem',
                          color: 'var(--neptune-text-secondary)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {dossier.queryBlocks[0]?.certifiedQueryText || 'No query text recorded.'}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: 'var(--neptune-text-secondary)', borderTop: '1px solid var(--neptune-border-subtle)', paddingTop: 6 }}>
                          <span>{dossier.statutoryClock.filedDate}</span>
                          <span style={{ color: 'var(--neptune-emerald-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <span>Open IDE</span>
                            <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
