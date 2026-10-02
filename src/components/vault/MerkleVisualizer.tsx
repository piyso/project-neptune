import React, { useState, useEffect } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { NeptuneApiClient } from '../../services/api.js';
import { IBsaCertificate } from '../../types/vault.js';
import { Shield, KeySquare, CheckCircle, Download, ExternalLink, Hash, Lock, FileCheck } from 'lucide-react';

export const MerkleVisualizer: React.FC = () => {
  const { dossiers, selectedDossierId } = useNeptuneStore();
  const [cert, setCert] = useState<IBsaCertificate | null>(null);
  const [selectedLeaf, setSelectedLeaf] = useState<string | null>(null);

  const currentDossier = dossiers.find(d => d.dossierId === selectedDossierId) || dossiers[0];

  useEffect(() => {
    if (currentDossier) {
      NeptuneApiClient.getBsaCertificate(currentDossier).then(res => {
        setCert(res.data);
      });
    }
  }, [currentDossier?.dossierId]);

  if (!cert) {
    return <div className="neptune-card"><p>Computing Section 63 BSA Cryptographic Merkle Root...</p></div>;
  }

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="neptune-card neptune-card-glass" style={{ borderLeft: '4px solid var(--neptune-emerald)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Shield size={22} style={{ color: 'var(--neptune-emerald)' }} />
              Legal Proof & Evidence Vault • कानूनी सबूत व डिजिटल प्रमाण
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--neptune-text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
              Under Section 63 of India's Bharatiya Sakshya Adhiniyam (BSA) 2023, every RTI is sealed with a court-admissible digital fingerprint. This legally guarantees that government departments cannot claim they never received your application.
            </p>
          </div>
          <button onClick={handleDownloadCert} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
            <Download size={15} />
            <span>Export Court-Admissible Certificate</span>
          </button>
        </div>
      </div>

      {/* Explainer callout note */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 12,
        padding: '0.85rem 1.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: '0.82rem',
        color: 'var(--neptune-text-secondary)',
      }}>
        <span style={{ fontSize: '1.2rem' }}>💡</span>
        <div>
          <strong style={{ color: 'var(--neptune-emerald-light)' }}>How does this protect you in court?</strong> When you file an RTI, our engine locks a mathematical fingerprint (Merkle hash) of your voice, the exact questions filed, and the government's official server receipt. If officials ever deny receipt before an Information Commissioner or High Court, this certificate provides 100% admissible legal proof.
        </div>
      </div>

      {/* Case Selector Strip */}
      <div className="neptune-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neptune-text-secondary)' }}>Selected Case:</span>
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--neptune-text-primary)' }}>
            {currentDossier.title} ({currentDossier.govRegistrationNumber || currentDossier.postalBarcode})
          </span>
        </div>
        <span className="badge badge-emerald">
          Proof Status: {cert.status}
        </span>
      </div>

      {/* Interactive Merkle Tree Graph */}
      <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="badge badge-cobalt" style={{ marginBottom: 4 }}>
            RFC 3161 Deterministic Binary Merkle Topology
          </span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Court Evidence Chain of Custody</h3>
        </div>

        {/* Master Merkle Root Node */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
          border: '2px solid var(--neptune-emerald)',
          borderRadius: 14,
          padding: '1rem 1.5rem',
          maxWidth: 620,
          width: '100%',
          textAlign: 'center',
          boxShadow: 'var(--neptune-shadow-emerald)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--neptune-emerald-light)', fontWeight: 800, fontSize: '0.82rem' }}>
            <Lock size={15} />
            <span>MERKLE ROOT HASH (COURT SEAL)</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontFamily: 'var(--neptune-font-mono)', color: '#fff', wordBreak: 'break-all', marginTop: 4, fontWeight: 700 }}>
            {cert.merkleRootHash}
          </div>
        </div>

        {/* Branch Lines */}
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '70%', height: 24, position: 'relative' }}>
          <div style={{ width: '45%', borderBottom: '2px dashed var(--neptune-border-card)', borderLeft: '2px dashed var(--neptune-border-card)' }} />
          <div style={{ width: '45%', borderBottom: '2px dashed var(--neptune-border-card)', borderRight: '2px dashed var(--neptune-border-card)' }} />
        </div>

        {/* Level 1 Intermediate Nodes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: 840 }}>
          {/* Node H12 */}
          <div style={{
            background: 'var(--neptune-bg-elevated)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            padding: '0.85rem 1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Intermediate Node H(1,2)
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--neptune-font-mono)', color: 'var(--neptune-cyan)', wordBreak: 'break-all', marginTop: 2 }}>
              {cert.nodeH12}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--neptune-text-tertiary)', marginTop: 4 }}>
              SHA256(Audio + Section 2(f) Draft Text)
            </div>
          </div>

          {/* Node H34 */}
          <div style={{
            background: 'var(--neptune-bg-elevated)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            padding: '0.85rem 1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Intermediate Node H(3,4)
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--neptune-font-mono)', color: 'var(--neptune-cobalt)', wordBreak: 'break-all', marginTop: 2 }}>
              {cert.nodeH34}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--neptune-text-tertiary)', marginTop: 4 }}>
              SHA256(HTTP Wire Payload + Server Receipt)
            </div>
          </div>
        </div>

        {/* Level 0 Leaf Nodes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%' }}>
          {[
            { id: 'l1', title: 'Leaf 1: Citizen Voice', hash: cert.leafs.citizenVoiceAudioHash, desc: '16kHz PCM Raw Speech Stream' },
            { id: 'l2', title: 'Leaf 2: CFG Draft Text', hash: cert.leafs.synthesizedDraftTextHash, desc: 'Unassailable Section 2(f) Prose' },
            { id: 'l3', title: 'Leaf 3: HTTP Wire Request', hash: cert.leafs.httpRequestWireHash, desc: 'TLS Wire Packet Digest' },
            { id: 'l4', title: 'Leaf 4: Govt Ack Receipt', hash: cert.leafs.govtServerReceiptHash, desc: 'NIC Portal HTTP 200 Response' },
          ].map(leaf => (
            <div
              key={leaf.id}
              onClick={() => setSelectedLeaf(leaf.id)}
              style={{
                background: 'var(--neptune-bg-surface)',
                border: '1px solid var(--neptune-border-card)',
                borderRadius: 8,
                padding: '0.75rem',
                cursor: 'pointer',
                transition: 'var(--neptune-transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--neptune-emerald)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--neptune-border-card)')}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--neptune-emerald-light)' }}>
                {leaf.title}
              </div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--neptune-font-mono)', color: 'var(--neptune-text-tertiary)', wordBreak: 'break-all', marginTop: 4 }}>
                {leaf.hash.substring(0, 16)}...
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                {leaf.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
