import React, { useState, useEffect } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { StatutoryTimeline } from './StatutoryTimeline.js';
import { AppealModal } from './AppealModal.js';
import { NoticeScannerModal } from './NoticeScannerModal.js';
import { LogisticsModal } from './LogisticsModal.js';
import { CicAppealModal } from './CicAppealModal.js';
import { CpioDispositionRadar } from './CpioDispositionRadar.js';
import { DossierKanban } from './DossierKanban.js';
import { TimelineEvent } from '../../types/timeline.js';
import { NeptuneApiClient } from '../../services/api.js';
import { ttsEngine } from '../../services/ttsService.js';
import {
  FileText,
  Clock,
  ShieldCheck,
  Scale,
  KeySquare,
  Volume2,
  VolumeX,
  Camera,
  Truck,
  LayoutGrid,
  Columns,
  Sparkles,
} from 'lucide-react';

export const DossierDetail: React.FC = () => {
  const {
    dossiers,
    selectedDossierId,
    selectDossier,
    setView,
    language,
    isKanbanView,
    setKanbanView,
    isNoticeScannerOpen,
    setNoticeScannerOpen,
    isLogisticsOpen,
    setLogisticsOpen,
    isCicAppealOpen,
    setCicAppealOpen,
  } = useNeptuneStore();

  const [activeTab, setActiveTab] = useState<'timeline' | 'query'>('timeline');
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [speakingBlockId, setSpeakingBlockId] = useState<string | null>(null);

  const dossier = dossiers.find(d => d.dossierId === selectedDossierId) || dossiers[0];

  useEffect(() => {
    if (dossier) {
      NeptuneApiClient.getTimelineEvents(dossier.dossierId).then(res => {
        setEvents(res.data);
      });
    }
  }, [dossier?.dossierId]);

  const handleToggleTts = (blockId: string, text: string) => {
    if (speakingBlockId === blockId) {
      ttsEngine.stop();
      setSpeakingBlockId(null);
    } else {
      setSpeakingBlockId(blockId);
      ttsEngine.speak(text, language, () => {
        setSpeakingBlockId(null);
      }, () => {
        setSpeakingBlockId(null);
      });
    }
  };

  if (isKanbanView) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--neptune-bg-card)', padding: '0.8rem 1.2rem', borderRadius: 14, border: '1px solid var(--neptune-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutGrid size={18} color="var(--neptune-emerald-light)" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Multi-Case Statutory Kanban Triage</h3>
          </div>
          <button
            onClick={() => setKanbanView(false)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Columns size={14} />
            <span>Switch to 3-Pane Litigation IDE</span>
          </button>
        </div>
        <DossierKanban />
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="neptune-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>No dossier selected. Please select a case from the queue or file a new RTI.</p>
        <button onClick={() => setView('intake')} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
          File New RTI
        </button>
      </div>
    );
  }

  const clock = dossier.statutoryClock;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 3-Pane Litigation Header */}
      <div className="neptune-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: clock.isOverdue ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: clock.isOverdue ? 'var(--neptune-crimson-light)' : 'var(--neptune-emerald-light)',
            }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{dossier.title}</h2>
                <span className={`badge ${clock.isOverdue ? 'badge-crimson' : 'badge-emerald'}`}>
                  {clock.stage.replace(/_/g, ' ')}
                </span>
                <span className="badge badge-neutral">
                  {dossier.filingChannel.replace(/_/g, ' ')}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--neptune-text-tertiary)', marginTop: 2 }}>
                Case ID: <span style={{ fontFamily: 'var(--neptune-font-mono)' }}>{dossier.govRegistrationNumber || dossier.postalBarcode || dossier.dossierId}</span> • Authority: <strong>{dossier.targetAuthority.canonicalName}</strong>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setKanbanView(true)} className="btn btn-secondary btn-sm" title="Open 6-Column Multi-Case Kanban Triage">
              <LayoutGrid size={14} />
              <span>Kanban</span>
            </button>

            <button onClick={() => setNoticeScannerOpen(true)} className="btn btn-secondary btn-sm" title="Scan degraded CPIO rejection notice with in-browser Sauvola binarizer">
              <Camera size={14} />
              <span>Notice Scanner</span>
            </button>

            <button onClick={() => setLogisticsOpen(true)} className="btn btn-secondary btn-sm" title="Track India Post Speed Post CEPT & ₹10 IPO Escrow">
              <Truck size={14} />
              <span>Speed Post</span>
            </button>

            <button onClick={() => setCicAppealOpen(true)} className="btn btn-secondary btn-sm" title="Generate CIC 12-Point Scrutiny Second Appeal Pleading">
              <Scale size={14} />
              <span>CIC 2nd Appeal</span>
            </button>

            <button onClick={() => setView('vault')} className="btn btn-secondary btn-sm">
              <KeySquare size={14} />
              <span>BSA Vault</span>
            </button>

            {clock.isOverdue && (
              <button onClick={() => setIsAppealModalOpen(true)} className="btn btn-danger btn-sm">
                <Scale size={14} />
                <span>1-Tap First Appeal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3-Pane Desktop Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 300px) minmax(380px, 1fr) minmax(320px, 400px)',
        gap: '1.25rem',
      }} className="litigation-3-pane-grid">
        {/* Pane 1: Active Cases Queue */}
        <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--neptune-border-card)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)' }}>
              Active Case Queue ({dossiers.length})
            </span>
            <button onClick={() => setView('intake')} className="btn btn-primary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>
              + New
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
            {dossiers.map(d => {
              const isSelected = d.dossierId === selectedDossierId;
              const isBreached = d.statutoryClock.isOverdue;

              return (
                <div
                  key={d.dossierId}
                  onClick={() => selectDossier(d.dossierId)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 10,
                    background: isSelected ? 'var(--neptune-bg-elevated)' : 'var(--neptune-bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                    cursor: 'pointer',
                    transition: 'var(--neptune-transition)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--neptune-font-mono)', color: 'var(--neptune-text-tertiary)' }}>
                      {d.govRegistrationNumber || d.postalBarcode || d.dossierId.substring(0, 12)}
                    </span>
                    <span className={`badge ${isBreached ? 'badge-crimson' : 'badge-emerald'}`} style={{ fontSize: '0.62rem' }}>
                      {isBreached ? 'DEEMED DENY' : `${d.statutoryClock.daysRemaining}d`}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--neptune-text-primary)', lineHeight: 1.3 }}>
                    {d.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)', marginTop: 4 }}>
                    {d.targetAuthority.canonicalName.substring(0, 32)}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pane 2: Dossier Center Content (Tabs: Timeline, CFG Query Blocks) */}
        <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Internal Tab Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--neptune-border-card)', paddingBottom: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`btn btn-sm ${activeTab === 'timeline' ? 'btn-primary' : 'btn-outline'}`}
            >
              <Clock size={14} />
              <span>Amazon-Style Statutory SLA</span>
            </button>
            <button
              onClick={() => setActiveTab('query')}
              className={`btn btn-sm ${activeTab === 'query' ? 'btn-primary' : 'btn-outline'}`}
            >
              <FileText size={14} />
              <span>Sec 2(f) Query Blocks ({dossier.queryBlocks.length})</span>
            </button>
          </div>

          {/* Tab 1: Quasi-Judicial Amazon Timeline */}
          {activeTab === 'timeline' && (
            <StatutoryTimeline
              dossier={dossier}
              events={events}
              onTriggerAppeal={() => setIsAppealModalOpen(true)}
            />
          )}

          {/* Tab 2: Context-Free Grammar Query Blocks */}
          {activeTab === 'query' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: 'var(--neptune-bg-surface)',
                border: '1px solid var(--neptune-border-card)',
                borderRadius: 8,
                padding: '0.75rem 1rem',
              }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700 }}>
                  Raw Citizen Grievance Narrative (Aadhaar Masked)
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--neptune-text-secondary)', marginTop: 4, fontStyle: 'italic' }}>
                  "{dossier.rawGrievanceNarrative}"
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dossier.queryBlocks.map((block) => (
                  <div
                    key={block.id}
                    style={{
                      background: 'var(--neptune-bg-elevated)',
                      border: '1px solid var(--neptune-border-card)',
                      borderRadius: 10,
                      padding: '0.9rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span className="badge badge-cobalt">
                        Point #{block.pointNumber} • {block.recordType}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {/* Vernacular TTS Readout Button */}
                        <button
                          onClick={() => handleToggleTts(block.id, block.certifiedQueryText)}
                          title="Listen to drafted query in selected Indic dialect"
                          style={{
                            background: speakingBlockId === block.id ? 'var(--neptune-emerald)' : 'rgba(255,255,255,0.06)',
                            border: 'none',
                            color: speakingBlockId === block.id ? '#000' : 'var(--neptune-emerald-light)',
                            borderRadius: 6,
                            padding: '3px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          {speakingBlockId === block.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                          <span>{speakingBlockId === block.id ? 'Stop' : 'Listen'}</span>
                        </button>

                        {block.preemptedClauses.map(c => (
                          <span key={c} className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>
                            Sec {c} Shielded
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--neptune-text-primary)', lineHeight: 1.45 }}>
                      {block.certifiedQueryText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pane 3: Legal Radar & CPIO Behavioral Disposition */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
          <CpioDispositionRadar
            authorityName={dossier.targetAuthority.canonicalName}
            cpioName={dossier.targetAuthority.cpioDesignation}
            resistanceScore={dossier.statutoryClock.isOverdue ? 92 : 68}
          />
        </div>
      </div>

      {/* Responsive media query styling */}
      <style>{`
        @media (max-width: 1024px) {
          .litigation-3-pane-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Modals Suite */}
      <AppealModal
        dossier={dossier}
        isOpen={isAppealModalOpen}
        onClose={() => setIsAppealModalOpen(false)}
      />

      <NoticeScannerModal
        isOpen={isNoticeScannerOpen}
        onClose={() => setNoticeScannerOpen(false)}
      />

      <LogisticsModal
        isOpen={isLogisticsOpen}
        onClose={() => setLogisticsOpen(false)}
        consignmentNumber={dossier.postalBarcode || 'ED918237461IN'}
        authorityName={dossier.targetAuthority.canonicalName}
      />

      <CicAppealModal
        isOpen={isCicAppealOpen}
        onClose={() => setCicAppealOpen(false)}
        dossier={dossier}
      />
    </div>
  );
};
