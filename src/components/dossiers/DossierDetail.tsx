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
  Volume2,
  VolumeX,
  Camera,
  Truck,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  LayoutGrid,
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

  const [activeTab, setActiveTab] = useState<'questions' | 'timeline' | 'evidence' | 'advocate'>('questions');
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [speakingBlockId, setSpeakingBlockId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const dossier = dossiers.find(d => d.dossierId === selectedDossierId) || dossiers[0];

  useEffect(() => {
    if (dossier) {
      NeptuneApiClient.getTimelineEvents(dossier.dossierId).then(res => {
        setEvents(res.data);
      });
    }
  }, [dossier?.dossierId]);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggleTts = (blockId: string, text: string) => {
    if (speakingBlockId === blockId) {
      ttsEngine.stop();
      setSpeakingBlockId(null);
    } else {
      setSpeakingBlockId(blockId);
      ttsEngine.speak(
        text,
        language,
        () => setSpeakingBlockId(null),
        () => setSpeakingBlockId(null)
      );
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
        <p>No RTI cases currently active.</p>
        <button onClick={() => setView('intake')} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
          Draft New RTI Application
        </button>
      </div>
    );
  }

  const clock = dossier.statutoryClock;

  if (isKanbanView) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--neptune-bg-card)', padding: '0.8rem 1.2rem', borderRadius: 14, border: '1px solid var(--neptune-border-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutGrid size={18} color="var(--neptune-emerald)" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Multi-Case Statutory Kanban Triage</h3>
          </div>
          <button
            onClick={() => setKanbanView(false)}
            className="btn btn-secondary btn-sm"
          >
            ← Return to Case Dossier
          </button>
        </div>
        <DossierKanban />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Case Selection Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neptune-text-tertiary)', whiteSpace: 'nowrap' }}>
            Active Cases:
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
                  background: isSelected ? 'var(--neptune-badge-emerald-bg)' : 'var(--neptune-bg-card)',
                  color: isSelected ? 'var(--neptune-emerald)' : 'var(--neptune-text-secondary)',
                  borderRadius: 20,
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  transition: 'var(--neptune-transition)',
                  boxShadow: isSelected ? 'var(--neptune-shadow-sm)' : 'none',
                }}
              >
                <span>{d.title.split('-')[0].trim()}</span>
                <span className={`badge ${isOverdue ? 'badge-crimson' : 'badge-emerald'}`} style={{ fontSize: '0.64rem', padding: '0.1rem 0.4rem' }}>
                  {isOverdue ? 'Overdue' : `${d.statutoryClock.daysRemaining}d left`}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setKanbanView(true)}
            className="btn btn-secondary btn-sm"
            title="Multi-case kanban board view"
            style={{ fontSize: '0.78rem' }}
          >
            <LayoutGrid size={14} />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setView('intake')}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            + Draft New RTI
          </button>
        </div>
      </div>

      {/* 2. Official Case Docket Hero Banner */}
      <div className="neptune-card" style={{
        borderLeft: `5px solid ${clock.isOverdue ? 'var(--neptune-crimson)' : 'var(--neptune-emerald)'}`,
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span className={`badge ${clock.isOverdue ? 'badge-crimson' : 'badge-emerald'}`} style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}>
                {clock.isOverdue ? '🔴 30-DAY STATUTORY DEADLINE EXPIRED (DEEMED REFUSAL)' : `🟢 IN PROGRESS • ${clock.daysRemaining} DAYS REMAINING`}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                {dossier.filingChannel === 'CENTRAL_ONLINE' ? 'NIC Central Online' : 'Speed Post + Postal Order'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.25rem 0 0.45rem 0', color: 'var(--neptune-text-primary)' }}>
              {dossier.title}
            </h2>

            <div style={{ fontSize: '0.86rem', color: 'var(--neptune-text-secondary)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span>Authority: <strong style={{ color: 'var(--neptune-text-primary)' }}>{dossier.targetAuthority.canonicalName}</strong></span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Docket Ref: <code style={{ color: 'var(--neptune-emerald)', fontWeight: 700 }}>{dossier.govRegistrationNumber || dossier.postalBarcode}</code>
                <button
                  onClick={() => handleCopy(dossier.govRegistrationNumber || dossier.postalBarcode || '', 'reg')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neptune-text-tertiary)', padding: 2 }}
                  title="Copy reference number"
                >
                  {copiedField === 'reg' ? <Check size={13} style={{ color: 'var(--neptune-emerald)' }} /> : <Copy size={13} />}
                </button>
              </span>
            </div>
          </div>

          {/* Right Action / Countdown Display */}
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
              background: 'var(--neptune-badge-emerald-bg)',
              border: '1px solid var(--neptune-badge-emerald-border)',
              borderRadius: 12,
              padding: '0.75rem 1.1rem',
              textAlign: 'right',
            }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--neptune-emerald)', fontWeight: 800 }}>
                Statutory Reply Deadline
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neptune-emerald)' }}>
                {new Date(clock.currentStatutoryDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                Officer must reply by this date
              </div>
            </div>
          )}
        </div>

        {/* 4-Step Statutory Progression */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1.1rem', borderTop: '1px solid var(--neptune-border-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'var(--neptune-bg-elevated)', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid var(--neptune-emerald)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neptune-emerald)' }}>✓ 1. Filed & Sealed</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)', marginTop: 2 }}>Submitted with ₹10 statutory fee</div>
            </div>
            <div style={{ background: 'var(--neptune-bg-elevated)', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid var(--neptune-emerald)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neptune-emerald)' }}>✓ 2. Delivered to Office</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)', marginTop: 2 }}>Delivered to CPIO desk</div>
            </div>
            <div style={{ background: 'var(--neptune-bg-elevated)', padding: '0.65rem 0.85rem', borderRadius: 10, border: `1px solid ${clock.isOverdue ? 'var(--neptune-crimson)' : 'var(--neptune-amber)'}` }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: clock.isOverdue ? 'var(--neptune-crimson)' : 'var(--neptune-amber)' }}>
                {clock.isOverdue ? '⚠️ 3. 30 Days Expired' : `⏳ 3. Under Review (Day ${30 - clock.daysRemaining})`}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)', marginTop: 2 }}>
                {clock.isOverdue ? 'Officer failed to provide records' : 'Compiling official records'}
              </div>
            </div>
            <div style={{ background: 'var(--neptune-bg-elevated)', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid var(--neptune-border-card)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neptune-text-secondary)' }}>4. Resolution / Appeal</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)', marginTop: 2 }}>Records furnished or First Appeal</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Case Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '1px solid var(--neptune-border-card)',
        paddingBottom: '0.25rem',
      }}>
        <button
          onClick={() => setActiveTab('questions')}
          style={{
            border: 'none',
            background: 'transparent',
            color: activeTab === 'questions' ? 'var(--neptune-emerald)' : 'var(--neptune-text-secondary)',
            borderBottom: activeTab === 'questions' ? '2px solid var(--neptune-emerald)' : '2px solid transparent',
            padding: '0.6rem 1rem',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'questions' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <FileText size={16} />
          <span>Official Questions Asked ({dossier.queryBlocks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          style={{
            border: 'none',
            background: 'transparent',
            color: activeTab === 'timeline' ? 'var(--neptune-emerald)' : 'var(--neptune-text-secondary)',
            borderBottom: activeTab === 'timeline' ? '2px solid var(--neptune-emerald)' : '2px solid transparent',
            padding: '0.6rem 1rem',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'timeline' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Truck size={16} />
          <span>Postal Delivery & Events</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          style={{
            border: 'none',
            background: 'transparent',
            color: activeTab === 'evidence' ? 'var(--neptune-emerald)' : 'var(--neptune-text-secondary)',
            borderBottom: activeTab === 'evidence' ? '2px solid var(--neptune-emerald)' : '2px solid transparent',
            padding: '0.6rem 1rem',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'evidence' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ShieldCheck size={16} />
          <span>Legal Proof (BSA 2023)</span>
        </button>

        <button
          onClick={() => setActiveTab('advocate')}
          style={{
            border: 'none',
            background: 'transparent',
            color: activeTab === 'advocate' ? 'var(--neptune-cobalt)' : 'var(--neptune-text-tertiary)',
            borderBottom: activeTab === 'advocate' ? '2px solid var(--neptune-cobalt)' : '2px solid transparent',
            padding: '0.6rem 1rem',
            fontSize: '0.88rem',
            fontWeight: activeTab === 'advocate' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginLeft: 'auto',
          }}
        >
          <Scale size={16} />
          <span>⚖️ Advocate & Appeal Tools</span>
        </button>
      </div>

      {/* 4. Tab Content Panels */}

      {/* TAB 1: QUESTIONS ASKED */}
      {activeTab === 'questions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 1.4fr) minmax(260px, 1fr)', gap: '1.25rem' }}>
          {/* Query list */}
          <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Certified Record Queries</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  Official questions submitted under Section 2(f) & Section 6(1) of the RTI Act
                </div>
              </div>
              <button
                onClick={handleDownloadRtiDocument}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
              >
                <Download size={14} style={{ color: 'var(--neptune-emerald)' }} />
                <span>Download Form 'A'</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {dossier.queryBlocks.map(block => (
                <div
                  key={block.id}
                  style={{
                    background: 'var(--neptune-bg-elevated)',
                    border: '1px solid var(--neptune-border-card)',
                    borderRadius: 12,
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                      Question #{block.pointNumber}
                    </span>
                    <button
                      onClick={() => handleToggleTts(block.id, block.certifiedQueryText)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                    >
                      {speakingBlockId === block.id ? <VolumeX size={13} /> : <Volume2 size={13} style={{ color: 'var(--neptune-emerald)' }} />}
                      <span>{speakingBlockId === block.id ? 'Stop' : 'Listen (सुनें)'}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--neptune-text-primary)', lineHeight: 1.5 }}>
                    {block.certifiedQueryText}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'var(--neptune-badge-cobalt-bg)',
              border: '1px solid var(--neptune-badge-cobalt-border)',
              borderRadius: 10,
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--neptune-badge-cobalt-text)',
            }}>
              💡 <strong>Statutory Power:</strong> Government officers are legally obligated to provide certified physical records or inspectable log extracts under Section 2(f). They cannot dismiss these requests with oral excuses.
            </div>
          </div>

          {/* Citizen Quick Actions Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Quick Actions</h3>

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

              <button
                onClick={() => setLogisticsOpen(true)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, padding: '0.75rem 1rem' }}
              >
                <Truck size={18} style={{ color: 'var(--neptune-amber)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>Track Postal Speed Post</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>CEPT Consignment: {dossier.postalBarcode || 'ED918237461IN'}</div>
                </div>
              </button>

              <button
                onClick={() => setNoticeScannerOpen(true)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, padding: '0.75rem 1rem' }}
              >
                <Camera size={18} style={{ color: 'var(--neptune-cyan)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>Upload Reply / Notice Received</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>Scan photo of officer's response</div>
                </div>
              </button>

              {clock.isOverdue && (
                <button
                  onClick={() => setIsAppealModalOpen(true)}
                  className="btn btn-danger"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, padding: '0.75rem 1rem' }}
                >
                  <Scale size={18} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>File Free First Appeal (1-Tap)</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)' }}>Section 19(1) deemed refusal appeal</div>
                  </div>
                </button>
              )}
            </div>

            {/* Target Authority Address Card */}
            <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700 }}>
                Target Department Address
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>{dossier.targetAuthority.canonicalName}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--neptune-text-secondary)', lineHeight: 1.4 }}>
                {dossier.targetAuthority.cpioDesignation}<br />
                {dossier.targetAuthority.officeAddress}<br />
                PIN: {dossier.targetAuthority.pincode}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POSTAL DELIVERY & TIMELINE */}
      {activeTab === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="neptune-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>India Post CEPT Tracking & Statutory Milestones</h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--neptune-text-secondary)' }}>
                  Live delivery synchronization with Department of Posts and statutory clock events.
                </p>
              </div>
              <button onClick={() => setLogisticsOpen(true)} className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
                <Truck size={14} style={{ color: 'var(--neptune-amber)' }} />
                <span>Open Detailed Logistics Modal</span>
              </button>
            </div>
            <StatutoryTimeline
              dossier={dossier}
              events={events}
              onTriggerAppeal={() => setIsAppealModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* TAB 3: LEGAL EVIDENCE (BSA 2023) */}
      {activeTab === 'evidence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                  Bharatiya Sakshya Adhiniyam (BSA) 2023 Digital Evidence Seal
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--neptune-text-secondary)' }}>
                  Certified electronic record certificate issued pursuant to Section 63 of BSA 2023.
                </p>
              </div>
              <button onClick={() => setView('vault')} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                <ShieldCheck size={15} />
                <span>Open Evidence Vault</span>
              </button>
            </div>

            <div style={{
              background: 'var(--neptune-bg-elevated)',
              border: '1px solid var(--neptune-border-card)',
              borderRadius: 12,
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700 }}>
                  Merkle Master Root Hash
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <code style={{ fontSize: '0.84rem', color: 'var(--neptune-emerald)', fontWeight: 700, wordBreak: 'break-all' }}>
                    {dossier.merkleRootHash}
                  </code>
                  <button
                    onClick={() => handleCopy(dossier.merkleRootHash, 'merkle')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neptune-text-tertiary)', padding: 2 }}
                  >
                    {copiedField === 'merkle' ? <Check size={14} style={{ color: 'var(--neptune-emerald)' }} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: 4 }}>
                <div style={{ background: 'var(--neptune-bg-card)', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--neptune-border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>Aadhaar Identity Masking</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--neptune-emerald)', marginTop: 2 }}>DPDP 2023 Section 8 Protected</div>
                </div>
                <div style={{ background: 'var(--neptune-bg-card)', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--neptune-border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>Court Admissibility</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--neptune-cobalt)', marginTop: 2 }}>All High Courts & CIC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADVOCATE TOOLS & CPIO RADAR */}
      {activeTab === 'advocate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Advocate Litigation Telemetry & CPIO Radar</h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--neptune-text-secondary)' }}>
                  Historical compliance metrics, Section 20(1) penalty calculations, and formal appellate drafting.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setIsAppealModalOpen(true)} className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
                  <Scale size={14} />
                  <span>Draft 1st Appeal (FAA)</span>
                </button>
                <button onClick={() => setCicAppealOpen(true)} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  <Scale size={14} />
                  <span>Draft CIC 2nd Appeal</span>
                </button>
              </div>
            </div>

            {/* CPIO Disposition Radar */}
            <CpioDispositionRadar
              authorityName={dossier.targetAuthority.canonicalName}
              cpioName={dossier.targetAuthority.cpioDesignation}
              resistanceScore={dossier.targetAuthority.complianceRating ? 100 - dossier.targetAuthority.complianceRating : 65}
            />
          </div>
        </div>
      )}

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
