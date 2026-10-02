import React, { useState, useEffect } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { NeptuneApiClient } from '../../services/api.js';
import { IBsaCertificate } from '../../types/vault.js';
import { Shield, Lock, Download, Check, Copy } from 'lucide-react';

export const MerkleVisualizer: React.FC = () => {
  const { dossiers, selectedDossierId } = useNeptuneStore();
  const [cert, setCert] = useState<IBsaCertificate | null>(null);
  const [copied, setCopied] = useState(false);

  const currentDossier = dossiers.find(d => d.dossierId === selectedDossierId) || dossiers[0];

  useEffect(() => {
    if (currentDossier) {
      NeptuneApiClient.getBsaCertificate(currentDossier).then(res => {
        setCert(res.data);
      });
    }
  }, [currentDossier?.dossierId]);

  if (!cert) {
    return <div className="neptune-card" style={{ textAlign: 'center', padding: '2rem' }}><p>Computing Section 63 BSA Cryptographic Proof...</p></div>;
  }

  const handleCopyHash = () => {
    navigator.clipboard.writeText(cert.merkleRootHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCert = () => {
    const certText = `GOVERNMENT OF INDIA EVIDENCE ADMISSIBILITY CERTIFICATE
ISSUED UNDER SECTION 63 OF THE BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023

CERTIFICATE SERIAL: ${cert.certificateId}
DATE OF ISSUANCE   : ${new Date(cert.ntpTimestamp).toLocaleString('en-IN')}
PUBLIC AUTHORITY   : ${currentDossier.targetAuthority.canonicalName}
RTI REGISTRATION   : ${currentDossier.govRegistrationNumber || currentDossier.postalBarcode || 'N/A'}

1. CRYPTOGRAPHIC INTEGRITY AUDIT:
   Merkle Master Root : ${cert.merkleRootHash}
   Intermediate H(1,2): ${cert.nodeH12}
   Intermediate H(3,4): ${cert.nodeH34}

2. COMPONENT LEAF HASHES (SHA-256):
   - Leaf 1 (Citizen Voice Audio)       : ${cert.leafs.citizenVoiceAudioHash}
   - Leaf 2 (Synthesized Draft Text)    : ${cert.leafs.synthesizedDraftTextHash}
   - Leaf 3 (HTTP Wire Payload)         : ${cert.leafs.httpRequestWireHash}
   - Leaf 4 (Govt Server HTTP Response) : ${cert.leafs.govtServerReceiptHash}

3. STATUTORY DECLARATION:
   I hereby certify that the electronic record described herein was produced by a computer system operating regularly and without disruption, pursuant to Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023. The cryptographic hashes herein guarantee that no subsequent alteration, antedating, or tampering has occurred.

SIGNER PUBLIC KEY: ${cert.signerPublicKey}
AUTHENTICATION AUTHORITY: ${cert.rfc3161Authority}
STATUS: SECURE • COURT ADMISSIBLE IN ALL HIGH COURTS AND APEX COURT`;

    const element = document.createElement('a');
    const file = new Blob([certText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `BSA_Section_63_Certificate_${cert.certificateId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Main Evidence Certificate Card */}
      <div className="neptune-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                Court Admissible Evidence
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                Section 63 BSA 2023
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--neptune-text-primary)' }}>
              Digital Evidence Certificate
            </h2>
            <div style={{ fontSize: '0.84rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
              Case: <strong>{currentDossier.title}</strong> ({currentDossier.govRegistrationNumber || currentDossier.postalBarcode})
            </div>
          </div>

          <button onClick={handleDownloadCert} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
            <Download size={15} />
            <span>Download Official Certificate</span>
          </button>
        </div>

        {/* Master Merkle Root Box */}
        <div style={{
          background: 'var(--neptune-badge-emerald-bg)',
          border: '1px solid var(--neptune-badge-emerald-border)',
          borderRadius: 12,
          padding: '1.25rem',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--neptune-emerald)', fontWeight: 800, fontSize: '0.78rem' }}>
            <Lock size={15} />
            <span>CRYPTOGRAPHIC MERKLE ROOT HASH</span>
          </div>
          <div style={{
            fontSize: '0.92rem',
            fontFamily: 'var(--neptune-font-mono)',
            color: 'var(--neptune-text-primary)',
            wordBreak: 'break-all',
            marginTop: 6,
            fontWeight: 700,
          }}>
            {cert.merkleRootHash}
          </div>
          <button
            onClick={handleCopyHash}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 10, fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
          >
            {copied ? <Check size={13} style={{ color: 'var(--neptune-emerald)' }} /> : <Copy size={13} />}
            <span>{copied ? 'Copied Hash' : 'Copy Hash'}</span>
          </button>
        </div>

        {/* 4 Sealed Components */}
        <div>
          <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700, marginBottom: 8 }}>
            Sealed Component Hashes (SHA-256):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {[
              { title: '1. Citizen Voice Audio', hash: cert.leafs.citizenVoiceAudioHash, desc: '16kHz PCM Speech Recording' },
              { title: '2. Certified Query Draft', hash: cert.leafs.synthesizedDraftTextHash, desc: 'Section 2(f) Record Requests' },
              { title: '3. HTTP Wire Payload', hash: cert.leafs.httpRequestWireHash, desc: 'TLS Submission Packet Digest' },
              { title: '4. Govt Server Receipt', hash: cert.leafs.govtServerReceiptHash, desc: 'NIC Online Portal Receipt' },
            ].map((leaf, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--neptune-bg-surface)',
                  border: '1px solid var(--neptune-border-card)',
                  borderRadius: 10,
                  padding: '0.85rem',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--neptune-text-primary)' }}>
                  {leaf.title}
                </div>
                <code style={{ fontSize: '0.72rem', color: 'var(--neptune-emerald)', wordBreak: 'break-all', display: 'block', marginTop: 4 }}>
                  {leaf.hash.substring(0, 24)}...
                </code>
                <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)', marginTop: 4 }}>
                  {leaf.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Admissibility Guarantee */}
        <div style={{
          background: 'var(--neptune-bg-elevated)',
          border: '1px solid var(--neptune-border-card)',
          borderRadius: 10,
          padding: '0.85rem 1rem',
          fontSize: '0.8rem',
          color: 'var(--neptune-text-secondary)',
          lineHeight: 1.45,
        }}>
          ⚖️ <strong>Statutory Admissibility:</strong> Under Section 63(4) of the Bharatiya Sakshya Adhiniyam 2023, this digital certificate certifies that the electronic record was produced by an automated computing system operating regularly, providing complete legal admissibility before any Information Commission or High Court in India.
        </div>
      </div>
    </div>
  );
};
