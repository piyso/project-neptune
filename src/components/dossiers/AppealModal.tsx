import React, { useState } from 'react';
import { ICitizenRTIDossier } from '../../types/dossier.js';
import { StatutoryTimelineEngine, FirstAppealDraft } from '../../services/timelineEngine.js';
import { Scale, Download, Copy, Check, X, ShieldCheck } from 'lucide-react';

interface AppealModalProps {
  dossier: ICitizenRTIDossier;
  isOpen: boolean;
  onClose: () => void;
}

export const AppealModal: React.FC<AppealModalProps> = ({ dossier, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appealDraft: FirstAppealDraft = StatutoryTimelineEngine.compileFirstAppeal(
    dossier.govRegistrationNumber || dossier.postalBarcode || 'PENDING-REG',
    dossier.targetAuthority.canonicalName,
    new Date(dossier.statutoryClock.filedDate).toLocaleDateString('en-IN')
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(appealDraft.fullDraftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([appealDraft.fullDraftText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Section_19_1_First_Appeal_${dossier.dossierId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 720, padding: '1.25rem' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--neptune-border-card)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale size={20} style={{ color: 'var(--neptune-crimson)' }} />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                Section 19(1) First Appeal Statutory Memo
              </h3>
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>
                Target Authority: {dossier.targetAuthority.appellateAuthorityDesignation}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--neptune-text-tertiary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Legal Invariant Notice */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 8,
          padding: '0.75rem',
          fontSize: '0.78rem',
          color: 'var(--neptune-text-secondary)',
          marginBottom: '1rem',
        }}>
          <strong style={{ color: 'var(--neptune-crimson-light)' }}>Ground of Appeal: Deemed Refusal Under Section 7(2).</strong> The CPIO failed to respond within 30 statutory days. By operation of law, Section 7(6) forfeiture applies, entitling the citizen to all certified documents with zero fee.
        </div>

        {/* Memo Draft Textbox */}
        <pre style={{
          background: 'var(--neptune-bg-surface)',
          border: '1px solid var(--neptune-border-card)',
          borderRadius: 8,
          padding: '1rem',
          fontSize: '0.8rem',
          color: 'var(--neptune-text-primary)',
          whiteSpace: 'pre-wrap',
          maxHeight: 340,
          overflowY: 'auto',
          lineHeight: 1.5,
          fontFamily: 'var(--neptune-font-mono)',
        }}>
          {appealDraft.fullDraftText}
        </pre>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--neptune-emerald-light)' }}>
            <ShieldCheck size={16} />
            <span>Ready for Portal Infill / Registered Speed Post Filing</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleCopy} className="btn btn-secondary btn-sm">
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Memo</>}
            </button>
            <button onClick={handleDownload} className="btn btn-primary btn-sm">
              <Download size={14} />
              <span>Download Text/PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
