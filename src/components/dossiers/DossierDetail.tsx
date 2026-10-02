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
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  User,
  Shield,
} from 'lucide-react';

export const DossierDetail: React.FC = () => {
  const {
    dossiers,
    selectedDossierId,
    selectDossier,
    setView,
    language,
    userMode,
    setUserMode,
    isKanbanView,
    setKanbanView,
    isNoticeScannerOpen,
    setNoticeScannerOpen,
    isLogisticsOpen,
    setLogisticsOpen,
    isCicAppealOpen,
    setCicAppealOpen,
    setHelpOpen,
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

  const handleDownloadRtiDocument = () => {
    if (!dossier) return;
    const certText = `======================================================================
FORM 'A' - RIGHT TO INFORMATION APPLICATION (RTI ACT, 2005)
======================================================================
APPLICATION REFERENCE : ${dossier.govRegistrationNumber || dossier.postalBarcode || dossier.dossierId}
DATE OF FILING        : ${new Date(dossier.createdAt).toLocaleDateString('en-IN')}

TO:
The Central / State Public Information Officer (CPIO / SPIO)
${dossier.targetAuthority.canonicalName}
${dossier.targetAuthority.cpioDesignation}
Office: ${dossier.targetAuthority.officeAddress} (PIN: ${dossier.targetAuthority.pincode})

1. CITIZEN PARTICULARS:
   Applicant Identity : Masked under Digital Personal Data Protection (DPDP) Act, 2023
   Service Address    : ${dossier.proxyAddressUsed}

2. PARTICULARS OF INFORMATION SOUGHT (UNDER SECTION 2(f) & SECTION 6(1)):
${dossier.queryBlocks.map(q => `   Point ${q.pointNumber}. ${q.certifiedQueryText}`).join('\n\n')}

3. STATUTORY TIMELINE:
   Statutory deadline for information delivery is 30 days pursuant to Section 7(1) of the RTI Act 2005.
   Failure to furnish certified information constitutes deemed refusal under Section 7(2).

4. FEE PARTICULARS:
   ₹10 Statutory Fee remitted via ${dossier.filingChannel === 'CENTRAL_ONLINE' ? 'Central Online Portal (rtionline.gov.in)' : 'Registered Indian Postal Order (IPO)'}.

5. CRYPTOGRAPHIC EVIDENCE SEAL:
   Bharatiya Sakshya Adhiniyam (BSA) 2023 Section 63 Merkle Hash:
   ${dossier.merkleRootHash}
======================================================================`;

    const element = document.createElement('a');
    const file = new Blob([certText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `RTI_Application_${dossier.dossierId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!dossier) {
    return (
      <div className="neptune-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>No RTI case selected. Please select a case from the queue or file a new RTI.</p>
        <button onClick={() => setView('intake')} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
          Draft New RTI Application
        </button>
      </div>
    );
  }

  const clock = dossier.statutoryClock;

  // ==========================================
  // CITIZEN VIEW: Clean, Simple, Friendly
  // ==========================================
  if (userMode === 'CITIZEN') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Case Switcher Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neptune-text-secondary)', whiteSpace: 'nowrap' }}>
            Select Case:
          </span>
          {dossiers.map(d => {
            const isSelected = d.dossierId === dossier.dossierId;
            const isOverdue = d.statutoryClock.isOverdue;
            return (
              <button
                key={d.dossierId}
                onClick={() => selectDossier(d.dossierId)}
                style={{
                  border: `1px solid ${isSelected ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                  background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'var(--neptune-bg-card)',
                  color: isSelected ? 'var(--neptune-emerald-light)' : 'var(--neptune-text-secondary)',
                  borderRadius: 20,
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  transition: 'var(--neptune-transition)',
                }}
              >
                <span>{d.title.split('-')[0].trim()}</span>
                <span className={`badge ${isOverdue ? 'badge-crimson' : 'badge-emerald'}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                  {isOverdue ? 'Overdue' : `${d.statutoryClock.daysRemaining}d left`}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setView('intake')}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 20, fontSize: '0.75rem', padding: '0.35rem 0.75rem', whiteSpace: 'nowrap' }}
          >
            + New RTI
          </button>
        </div>

        {/* Big Status Hero Card */}
        <div className="neptune-card" style={{
          borderLeft: `5px solid ${clock.isOverdue ? 'var(--neptune-crimson)' : 'var(--neptune-emerald)'}`,
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className={`badge ${clock.isOverdue ? 'badge-crimson' : 'badge-emerald'}`} style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}>
                  {clock.isOverdue ? '🔴 30-DAY LIMIT EXPIRED (DEEMED REFUSAL)' : `🟢 IN PROGRESS • ${clock.daysRemaining} DAYS REMAINING`}
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                  {dossier.filingChannel === 'CENTRAL_ONLINE' ? 'NIC Central Portal' : 'Speed Post + IPO'}
                </span>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.2rem 0 0.4rem 0' }}>
                {dossier.title}
              </h2>

              <div style={{ fontSize: '0.84rem', color: 'var(--neptune-text-secondary)' }}>
                Target Department: <strong style={{ color: 'var(--neptune-text-primary)' }}>{dossier.targetAuthority.canonicalName}</strong>
                <span style={{ margin: '0 8px' }}>•</span>
                Case No: <span style={{ fontFamily: 'var(--neptune-font-mono)', fontWeight: 600 }}>{dossier.govRegistrationNumber || dossier.postalBarcode}</span>
              </div>
            </div>

            {/* If Overdue, highlight 1-tap appeal */}
            {clock.isOverdue ? (
              <button
                onClick={() => setIsAppealModalOpen(true)}
                className="btn btn-danger btn-lg"
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800 }}
              >
                <Scale size={18} />
                <span>File Free First Appeal (1-Tap)</span>
              </button>
            ) : (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 12,
                padding: '0.75rem 1rem',
                textAlign: 'right',
              }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700 }}>
                  Statutory Reply Deadline
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--neptune-emerald-light)' }}>
                  {new Date(clock.currentStatutoryDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  Officer must reply by this date
                </div>
              </div>
            )}
          </div>

          {/* 4-Step Milestone Progress Bar */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--neptune-border-card)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neptune-text-secondary)', marginBottom: 10 }}>
              Statutory Progress Tracker (सरकारी समय सीमा):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: 'var(--neptune-bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid var(--neptune-emerald)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neptune-emerald-light)' }}>✓ 1. Filed & Sealed</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--neptune-text-tertiary)', marginTop: 2 }}>Application submitted with ₹10 fee</div>
              </div>
              <div style={{ background: 'var(--neptune-bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid var(--neptune-emerald)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neptune-emerald-light)' }}>✓ 2. Delivered to Office</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--neptune-text-tertiary)', marginTop: 2 }}>Received on officer's desk</div>
              </div>
              <div style={{ background: 'var(--neptune-bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 10, border: `1px solid ${clock.isOverdue ? 'var(--neptune-crimson)' : 'var(--neptune-amber)'}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: clock.isOverdue ? 'var(--neptune-crimson-light)' : 'var(--neptune-amber-light)' }}>
                  {clock.isOverdue ? '⚠️ 3. 30 Days Passed' : `⏳ 3. Under Review (Day ${30 - clock.daysRemaining})`}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--neptune-text-tertiary)', marginTop: 2 }}>
                  {clock.isOverdue ? 'Officer failed to reply in time' : 'Officer compiling records'}
                </div>
              </div>
              <div style={{ background: 'var(--neptune-bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid var(--neptune-border-card)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neptune-text-secondary)' }}>4. Resolution / Appeal</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--neptune-text-tertiary)', marginTop: 2 }}>Get records or file 1st Appeal</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Citizen Workspace: Left Questions Asked | Right Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.4fr) minmax(280px, 1fr)', gap: '1.25rem' }}>
          {/* Left Column: Official Questions Asked */}
          <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                  What We Asked the Government
                </h3>
                <div style={{ fontSize: '0.76rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  Certified record requests (Section 2(f)) officers must legally answer
                </div>
              </div>
              <span className="badge badge-cobalt">
                {dossier.queryBlocks.length} Questions
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dossier.queryBlocks.map(block => (
                <div
                  key={block.id}
                  style={{
                    background: 'var(--neptune-bg-elevated)',
                    border: '1px solid var(--neptune-border-card)',
                    borderRadius: 12,
                    padding: '0.9rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                      Question #{block.pointNumber}
                    </span>
                    <button
                      onClick={() => handleToggleTts(block.id, block.certifiedQueryText)}
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
                      <span>{speakingBlockId === block.id ? 'Stop' : 'Listen (सुनें)'}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--neptune-text-primary)', lineHeight: 1.45 }}>
                    {block.certifiedQueryText}
                  </div>
                </div>
              ))}
            </div>

            {/* Helper note */}
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: 8,
              padding: '0.65rem 0.85rem',
              fontSize: '0.78rem',
              color: 'var(--neptune-text-secondary)',
            }}>
              💡 <strong>Why these specific questions?</strong> Officials cannot dismiss these queries because they request actual certified physical records, inspection logs, and inquiry reports under Section 2(f) of the RTI Act.
            </div>
          </div>

          {/* Right Column: Quick Citizen Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                Citizen Actions
              </h3>
              <div style={{ fontSize: '0.76rem', color: 'var(--neptune-text-secondary)' }}>
                1-tap actions to manage your application
              </div>

              {/* Action 1: Download PDF */}
              <button
                onClick={handleDownloadRtiDocument}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, padding: '0.75rem 1rem' }}
              >
                <Download size={18} style={{ color: 'var(--neptune-emerald)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>Download Official RTI (PDF/Text)</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>Save or print official Form 'A' copy</div>
                </div>
              </button>

              {/* Action 2: Track Speed Post */}
              <button
                onClick={() => setLogisticsOpen(true)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, padding: '0.75rem 1rem' }}
              >
                <Truck size={18} style={{ color: 'var(--neptune-amber)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>Track Postal Speed Post</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>Live CEPT tracking: {dossier.postalBarcode || 'ED918237461IN'}</div>
                </div>
              </button>

              {/* Action 3: Scan Reply */}
              <button
                onClick={() => setNoticeScannerOpen(true)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, padding: '0.75rem 1rem' }}
              >
                <Camera size={18} style={{ color: 'var(--neptune-cyan)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>I Received a Reply / Scan Letter</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>Upload photo of officer's notice or rejection</div>
                </div>
              </button>

              {/* Action 4: Vault Proof */}
              <button
                onClick={() => setView('vault')}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, padding: '0.75rem 1rem' }}
              >
                <Shield size={18} style={{ color: 'var(--neptune-emerald)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>View Legal Proof Certificate</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>BSA 2023 tamper-proof digital evidence</div>
                </div>
              </button>

              {/* Action 5: Appeal if Overdue */}
              {clock.isOverdue && (
                <button
                  onClick={() => setIsAppealModalOpen(true)}
                  className="btn btn-danger"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, padding: '0.75rem 1rem' }}
                >
                  <Scale size={18} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>File Free First Appeal (1-Tap)</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)' }}>Officer delayed beyond 30 days</div>
                  </div>
                </button>
              )}
            </div>

            {/* Advocate Mode Switcher Card */}
            <div style={{
              background: 'var(--neptune-bg-surface)',
              border: '1px solid var(--neptune-border-card)',
              borderRadius: 12,
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Are you an advocate or lawyer?</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>Switch to the 3-pane litigation cockpit with CPIO radar</div>
              </div>
              <button
                onClick={() => setUserMode('ADVOCATE')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.74rem', whiteSpace: 'nowrap' }}
              >
                <span>Advocate Mode →</span>
              </button>
            </div>
          </div>
        </div>

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
  }

  // ==========================================
  // ADVOCATE PRO VIEW: Full 3-Pane Litigation Suite
  // ==========================================
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
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setUserMode('CITIZEN')}
              className="btn btn-secondary btn-sm"
              title="Switch back to simple Citizen view"
            >
              <User size={14} />
              <span>Citizen View</span>
            </button>

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
