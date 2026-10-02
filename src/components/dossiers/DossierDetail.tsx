import React, { useState, useEffect } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
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
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Shield,
  Send,
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

  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [speakingBlockId, setSpeakingBlockId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Collapsible Accordion States (Clean, uncluttered defaults)
  const [showQuestions, setShowQuestions] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showAdvocateRadar, setShowAdvocateRadar] = useState(false);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--neptune-bg-card)', padding: '0.8rem 1.2rem', borderRadius: 12, border: '1px solid var(--neptune-border-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutGrid size={18} color="var(--neptune-emerald)" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Multi-Case Statutory Kanban Triage</h3>
          </div>
          <button onClick={() => setKanbanView(false)} className="btn btn-secondary btn-sm">
            ← Return to Case Docket
          </button>
        </div>
        <DossierKanban />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Sleek Case Selector Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.15rem' }}>
          {dossiers.map(d => {
            const isSelected = d.dossierId === dossier.dossierId;
            const isOverdue = d.statutoryClock.isOverdue;
            return (
              <button
                key={d.dossierId}
                onClick={() => selectDossier(d.dossierId)}
                style={{
                  border: `1px solid ${isSelected ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                  background: isSelected ? 'var(--neptune-badge-emerald-bg)' : 'var(--neptune-bg-surface)',
                  color: isSelected ? 'var(--neptune-emerald)' : 'var(--neptune-text-secondary)',
                  borderRadius: 20,
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8rem',
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
                  {isOverdue ? 'Overdue' : `${d.statutoryClock.daysRemaining}d`}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setKanbanView(true)}
            className="btn btn-secondary btn-sm"
            title="Switch to Multi-case Kanban view"
            style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
          >
            <LayoutGrid size={13} />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setView('intake')}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
          >
            + New RTI
          </button>
        </div>
      </div>

      {/* 2. Amazon-Style Master Case Docket Card */}
      <div className="neptune-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header: Title & Reference */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className={`badge ${clock.isOverdue ? 'badge-crimson' : 'badge-emerald'}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
              {clock.isOverdue ? '🔴 STATUTORY DEADLINE EXPIRED (DEEMED REFUSAL)' : `🟢 IN PROGRESS • ${clock.daysRemaining} DAYS REMAINING`}
            </span>
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.2rem 0', color: 'var(--neptune-text-primary)' }}>
            {dossier.title}
          </h2>

          <div style={{ fontSize: '0.84rem', color: 'var(--neptune-text-secondary)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <span>Target: <strong style={{ color: 'var(--neptune-text-primary)' }}>{dossier.targetAuthority.canonicalName}</strong></span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Ref: <code style={{ color: 'var(--neptune-emerald)', fontWeight: 700 }}>{dossier.govRegistrationNumber || dossier.postalBarcode}</code>
              <button
                onClick={() => handleCopy(dossier.govRegistrationNumber || dossier.postalBarcode || '', 'reg')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neptune-text-tertiary)', padding: 2 }}
                title="Copy reference number"
              >
                {copiedField === 'reg' ? <Check size={12} style={{ color: 'var(--neptune-emerald)' }} /> : <Copy size={12} />}
              </button>
            </span>
          </div>
        </div>

        {/* Amazon-Style Vertical Statutory Delivery Tracker */}
        <div style={{
          background: 'var(--neptune-bg-surface)',
          border: '1px solid var(--neptune-border-card)',
          borderRadius: 12,
          padding: '1.25rem',
        }}>
          <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700, marginBottom: '1rem' }}>
            Statutory Progress Tracker (समय सीमा स्थिति)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', position: 'relative' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--neptune-emerald)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}>
                <Check size={13} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--neptune-text-primary)' }}>1. Filed & Cryptographically Sealed</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--neptune-text-tertiary)' }}>{new Date(dossier.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  ₹10 fee remitted • Section 63 BSA Merkle root sealed
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--neptune-emerald)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}>
                <Check size={13} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--neptune-text-primary)' }}>2. Delivered to CPIO Office</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--neptune-text-tertiary)' }}>Confirmed</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  Acknowledged by {dossier.targetAuthority.cpioDesignation}
                </div>
              </div>
            </div>

            {/* Step 3 (Active Step) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: clock.isOverdue ? 'var(--neptune-crimson)' : 'var(--neptune-amber)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}>
                <Clock size={12} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem', color: clock.isOverdue ? 'var(--neptune-crimson)' : 'var(--neptune-text-primary)' }}>
                    {clock.isOverdue ? '3. Statutory 30 Days Expired (Deemed Refusal)' : `3. CPIO Review & Record Search (Day ${30 - clock.daysRemaining} of 30)`}
                  </strong>
                  <span className={`badge ${clock.isOverdue ? 'badge-crimson' : 'badge-amber'}`} style={{ fontSize: '0.64rem' }}>
                    {clock.isOverdue ? 'ACTION REQUIRED' : 'ACTIVE NOW'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  {clock.isOverdue
                    ? 'The officer failed to reply within the legal deadline. You are entitled to a 100% free First Appeal.'
                    : `Officer must deliver information by ${new Date(clock.currentStatutoryDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.`}
                </div>
              </div>
            </div>

            {/* Step 4 (Future Step) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, opacity: clock.isOverdue ? 1 : 0.6 }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--neptune-border-card)',
                color: 'var(--neptune-text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}>
                <Scale size={12} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--neptune-text-primary)' }}>4. Resolution or First Appeal</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--neptune-text-tertiary)' }}>Due: {new Date(clock.currentStatutoryDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  {clock.isOverdue ? 'First Appeal ready to submit under Section 19(1)' : 'Receive certified records or file free First Appeal'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {clock.isOverdue && (
            <button
              onClick={() => setIsAppealModalOpen(true)}
              className="btn btn-danger btn-md"
              style={{ fontWeight: 800, flex: '1 1 200px' }}
            >
              <Scale size={16} />
              <span>File Free First Appeal (1-Tap)</span>
            </button>
          )}

          <button
            onClick={handleDownloadRtiDocument}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
          >
            <Download size={14} style={{ color: 'var(--neptune-emerald)' }} />
            <span>Download Form 'A' (PDF/Text)</span>
          </button>

          <button
            onClick={() => setLogisticsOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
          >
            <Truck size={14} style={{ color: 'var(--neptune-amber)' }} />
            <span>Track Speed Post</span>
          </button>

          <button
            onClick={() => setNoticeScannerOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
          >
            <Camera size={14} style={{ color: 'var(--neptune-cobalt)' }} />
            <span>Upload Officer's Reply</span>
          </button>
        </div>

        {/* 3. Clean Disclosure Accordions (Zero Clutter) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          {/* Accordion 1: Questions Asked */}
          <div style={{
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setShowQuestions(!showQuestions)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--neptune-bg-surface)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--neptune-text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} style={{ color: 'var(--neptune-emerald)' }} />
                <span>Questions Asked to Government ({dossier.queryBlocks.length} Queries)</span>
              </div>
              {showQuestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showQuestions && (
              <div style={{ padding: '1rem', background: 'var(--neptune-bg-elevated)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dossier.queryBlocks.map(block => (
                  <div key={block.id} style={{ background: 'var(--neptune-bg-surface)', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid var(--neptune-border-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.64rem' }}>
                        Question #{block.pointNumber}
                      </span>
                      <button
                        onClick={() => handleToggleTts(block.id, block.certifiedQueryText)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                      >
                        {speakingBlockId === block.id ? <VolumeX size={12} /> : <Volume2 size={12} style={{ color: 'var(--neptune-emerald)' }} />}
                        <span>{speakingBlockId === block.id ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--neptune-text-primary)', lineHeight: 1.45 }}>
                      {block.certifiedQueryText}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 2: Legal Evidence & BSA 2023 Seal */}
          <div style={{
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--neptune-bg-surface)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--neptune-text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={16} style={{ color: 'var(--neptune-emerald)' }} />
                <span>Legal Proof & Section 63 BSA Digital Seal</span>
              </div>
              {showEvidence ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showEvidence && (
              <div style={{ padding: '1rem', background: 'var(--neptune-bg-elevated)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700 }}>
                    Merkle Master Root Hash (Bharatiya Sakshya Adhiniyam 2023)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <code style={{ fontSize: '0.82rem', color: 'var(--neptune-emerald)', fontWeight: 700, wordBreak: 'break-all' }}>
                      {dossier.merkleRootHash}
                    </code>
                    <button
                      onClick={() => handleCopy(dossier.merkleRootHash, 'merkle')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neptune-text-tertiary)' }}
                    >
                      {copiedField === 'merkle' ? <Check size={13} style={{ color: 'var(--neptune-emerald)' }} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)' }}>
                    ✓ Admissible before High Courts & Central Information Commission
                  </div>
                  <button onClick={() => setView('vault')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.76rem' }}>
                    Open Evidence Vault →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3: CPIO Historical Radar & Advocate Tools */}
          <div style={{
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setShowAdvocateRadar(!showAdvocateRadar)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--neptune-bg-surface)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--neptune-text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scale size={16} style={{ color: 'var(--neptune-cobalt)' }} />
                <span>CPIO Historical Radar & Appellate Pleadings (Advocate Tools)</span>
              </div>
              {showAdvocateRadar ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvocateRadar && (
              <div style={{ padding: '1rem', background: 'var(--neptune-bg-elevated)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <CpioDispositionRadar
                  authorityName={dossier.targetAuthority.canonicalName}
                  cpioName={dossier.targetAuthority.cpioDesignation}
                  resistanceScore={dossier.targetAuthority.complianceRating ? 100 - dossier.targetAuthority.complianceRating : 65}
                />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => setIsAppealModalOpen(true)} className="btn btn-secondary btn-sm">
                    Draft 1st Appeal (FAA)
                  </button>
                  <button onClick={() => setCicAppealOpen(true)} className="btn btn-primary btn-sm">
                    Draft CIC 2nd Appeal Pleading
                  </button>
                </div>
              </div>
            )}
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
};
